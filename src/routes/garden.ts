import z from "zod";
import { URLSearchParams } from "url";
import { MapData } from "../lib/mapData.js";
import { prisma } from "../lib/prismaClient.js";
import { authenticate } from "../plugin/jwt.js";
import { uploadFile } from "../utils/upload.js";
import type { FastifyTypedInstance } from "../types.js";
import type { MapDataCoding } from "../@types/mapData.type.js";
import { CEP } from "../lib/cep.js";
import type { CEPType } from "../@types/cep.type.js";

export async function GardenRoute(app: FastifyTypedInstance) {
  app.get(
    "/garden/count",
    {
      schema: {
        tags: ["garden"],
        description: "Count all gardens",
      },
    },
    async (_, res) => {
      const gardens = await prisma.garden.count();

      return res.send({ gardens }).code(200);
    }
  );

  app.post(
    "/garden/create",
    {
      onRequest: [authenticate],
      schema: {
        tags: ["garden"],
        description: "Create a new garden",
        body: z
          .object({
            name: z.string(),
            cep: z.string().max(8).min(8),
            place: z.string(),
            number: z.int(),
            tamanho_m2: z.int(),
            img: z
              .file()
              .max(1024 * 1024 * 10)
              .mime(["image/png", "image/jpeg", "image/svg+xml"]),
          })
          .meta({
            example: {
              name: "Horta 01",
              cep: "13970000",
              place: "R. Tereza Lera Paoletti",
              number: 200,
              tamanho_m2: 4,
              img: new File(["foo"], "teste.png", {
                type: "image/png",
              }),
            },
          }),
      },
    },
    async (req, res) => {
      const { cep, name, number, tamanho_m2, place, img } = req.body;

      const placeParams = new URLSearchParams(place).toString();
      const response = await MapData.get<MapDataCoding>(
        `/geocoding.php?query=${placeParams}&country=br`
      );

      const mapData = response.data.data;

      let garden = await prisma.garden.findUnique({
        where: {
          lat_lng: {
            lat: Number(mapData.lat),
            lng: Number(mapData.lng),
          },
          cep_number: {
            cep,
            number,
          },
        },
      });

      if (garden) {
        return res.send({ error: "Garden Already exists." }).code(400);
      }

      const image = await req.file();

      if (!image) {
        return res.send({ error: "Image not found" }).code(400);
      }

      const uploadRes = await uploadFile(image, name);

      garden = await prisma.garden.create({
        data: {
          name,
          lat: mapData.lat,
          lng: mapData.lng,
          cep,
          number,
          tamanho_m2,
          img_url: uploadRes.imgUrl,
          owner: {
            connect: { id: req.user.sub },
          },
        },
      });

      return res.send({ data: garden }).code(201);
    }
  );

  app.get(
    "/garden/:id",
    {
      schema: {
        tags: ["garden"],
        description: "Get a garden by id",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (req, res) => {
      const { id } = req.params;

      const garden = await prisma.garden.findUnique({
        where: {
          id,
        },
        include: {
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!garden) {
        return res.send({ error: "Garden not found" }).code(404);
      }

      const cepResponse = await CEP.get<CEPType>(`/${garden.cep}/json`);

      if (!cepResponse) {
        return res.send({ error: "CEP not found" }).code(404);
      }

      const cepData = cepResponse.data;

      const data = {
        garden: {
          ...garden,
          img_url: `http://localhost:3333` + garden.img_url,
        },
        location: {
          city: cepData.localidade,
          state: cepData.uf,
          street: cepData.logradouro,
        },
      };

      return res.send({ data }).code(200);
    }
  );

  app.get(
    "/garden/all",
    {
      schema: {
        tags: ["garden"],
        description: "Get all gardens",
      },
    },
    async (req, res) => {
      const gardens = await prisma.garden.findMany({
        include: {
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      const dataPromises = gardens.map(async (garden) => {
        const cepResponse = await CEP.get<CEPType>(`/${garden.cep}/json`);
        const cepData = cepResponse.data;

        return {
          garden: {
            ...garden,
            img_url: `http://localhost:3333` + garden.img_url,
          },
          location: {
            city: cepData.localidade,
            state: cepData.uf,
            street: cepData.logradouro,
          },
        };
      });

      const data = await Promise.all(dataPromises);
      return res.send({ data }).code(200);
    }
  );
}
