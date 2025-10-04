import { prisma } from "../lib/prismaClient.js";
import type { FastifyTypedInstance } from "../types.js";
import { z } from "zod";
import { hashPassword, verifyHashPassword } from "../utils/crypto.js";

export async function UserRoute(app: FastifyTypedInstance) {
  app.get(
    "/user/count",
    {
      schema: {
        tags: ["user"],
        description: "Count all users",
      },
    },
    async (req, res) => {
      const users = await prisma.user.count();

      return res.send({ usersCount: users }).code(200);
    }
  );

  app.post(
    "/user/create",
    {
      schema: {
        tags: ["user"],
        description: "Create a new user",
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string(),
          phone: z.string(),
        }),
      },
    },
    async (req, res) => {
      const { email, password, name, phone } = req.body;
      let user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        res.send({ error: "User already exists." }).code(500);
      }

      const { hash, salt } = hashPassword(password);

      user = await prisma.user.create({
        data: {
          email,
          password: hash,
          passwordSalt: salt,
          name,
          phone,
        },
      });

      const token = app.jwt.sign(
        {
          name,
          email,
          phone,
          password: hash,
        },
        {
          sub: user.id,
          expiresIn: "7 days",
        }
      );

      return res.send({ token }).code(201);
    }
  );

  app.post(
    "/user/signin",
    {
      schema: {
        tags: ["user"],
        description: "User sign in",
        body: z.object({
          password: z.string(),
          email: z.email(),
        }),
      },
    },
    async (req, res) => {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return res.send({ error: "User not found." }).code(400);
      }

      const verifyPassword = verifyHashPassword({
        password,
        hash: user.password,
        salt: user.passwordSalt,
      });

      if (!verifyPassword) {
        return res.send({ error: "Password is wrong" }).code(400);
      }

      const token = app.jwt.sign(
        {
          name: user.name,
          email: user.email,
          phone: user.phone,
          password: user.password,
        },
        {
          sub: user.id,
          expiresIn: "7 days",
        }
      );

      return res.send({ token }).code(200);
    }
  );
}
