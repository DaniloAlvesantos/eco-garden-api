import { prisma } from "../lib/prismaClient";
import { authenticate } from "../plugin/jwt";
import type { FastifyTypedInstance } from "../types";
import { z } from "zod";

export async function PlantRoute(app: FastifyTypedInstance) {
  app.post(
    "/plant/create",
    {
      schema: {
        tags: ["plant"],
        description: "Create a new plant",
        body: z.object({
          nomeComum: z.string(),
          nomeCientifico: z.string(),
          umidadeMin: z.int(),
          umidadeMax: z.int(),
          tempMin: z.int(),
          tempMax: z.int(),
        }),
      },
      onRequest: [authenticate],
    },
    async (req, res) => {
      const {
        nomeComum,
        nomeCientifico,
        umidadeMin,
        umidadeMax,
        tempMin,
        tempMax,
      } = req.body;

      let plant = await prisma.plant.findUnique({
        where: {
          nomeCientifico,
        },
      });

      if (plant) {
        return res.send({ error: "Plant Already exists." }).code(400);
      }

      plant = await prisma.plant.create({
        data: {
          nomeComum,
          nomeCientifico,
          umidadeMin,
          umidadeMax,
          tempMin,
          tempMax,
        },
      });

      return res.send({ plant }).code(201);
    }
  );

  app.get(
    "/plant/:name",
    {
      schema: {
        tags: ["plant"],
        description: "Get a plant by name",
        params: z.object({
          name: z.string(),
        }),
      },
    },
    async (req, res) => {
      const { name } = req.params;

      console.log(name)

      let plants = await prisma.plant.findMany({
        where: {
          nomeComum: {
            contains: name,
          },
        },
      });

      if (!plants) return res.send({ error: "Plants not found" }).code(404);

      return res.send({ plants }).code(200);
    }
  );
}
