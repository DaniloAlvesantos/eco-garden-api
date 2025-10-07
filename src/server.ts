import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import { UserRoute } from "./routes/user.js";
import { GardenRoute } from "./routes/garden.js";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "node:path";

export const UPLOADS_DIR = path.join(process.cwd(), "uploads");

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyStatic, {
  root: UPLOADS_DIR,
  prefix: "/uploads/",
});
app.register(fastifyCors, { origin: "*" });
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

app.register(fastifyMultipart);

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.get("/", () => "hello world");
app.register(UserRoute);
app.register(GardenRoute);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP running on port:3333");
});
