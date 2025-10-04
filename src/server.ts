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

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

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
  transform: jsonSchemaTransform
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.get("/", () => "hello world");
app.register(UserRoute);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP running on port:3333");
});
