import "dotenv/config";
import { fastify } from "fastify";

import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

import fastifyJwt from "@fastify/jwt";
import { fastifyCors } from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifyFirebase from "fastify-firebase";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyMultipart from "@fastify/multipart";

import path from "node:path";

import { serviceAccount } from "./lib/firebase/admin.js";

import { UserRoute } from "./routes/user.js";
import { GardenRoute } from "./routes/garden.js";
import { SensorRoute } from "./routes/sensor.js";

export const UPLOADS_DIR = path.join(process.cwd(), "uploads");

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyStatic, {
  root: UPLOADS_DIR,
  prefix: "/uploads/",
});

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});
app.register(fastifyJwt, {
  secret: "ecogarden-api-2025",
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "EcoGarden API",
      version: "0.0.1",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifyMultipart); // 👈 Correctly registered here
app.register(fastifyFirebase, serviceAccount as any);

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});
// END PLUGINS / CONFIGS

/* ROUTES */
app.get("/", () => "hello world");
app.register(UserRoute);
app.register(GardenRoute);
app.register(SensorRoute);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP running on port:3333");
});
