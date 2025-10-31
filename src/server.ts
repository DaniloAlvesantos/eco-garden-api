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
import { fileURLToPath } from "node:url";
import { UserRoute } from "./routes/user.js";
import { GardenRoute } from "./routes/garden.js";

// Load env vars
import "dotenv/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Define Firebase credentials safely
let serviceAccount: any;

if (process.env.NODE_ENV === "development") {
  // Local JSON file (ignored by git and Vercel)
  serviceAccount = await import("./config/firebase.json", {
    assert: { type: "json" },
  }).then((m) => m.default);
} else {
  // Use environment variables on Vercel
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };
}

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyStatic, {
  root: UPLOADS_DIR,
  prefix: "/uploads/",
});

app.register(fastifyCors, { origin: "*" });
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "ecogarden-api-2025",
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
app.register(fastifyFirebase, serviceAccount);

app.register(fastifySwaggerUi, { routePrefix: "/docs" });

/* ROUTES */
app.get("/", () => "hello world");
app.register(UserRoute);
app.register(GardenRoute);

app
  .listen({ port: process.env.PORT ? Number(process.env.PORT) : 3333, host: "0.0.0.0" })
  .then(() => console.log("✅ HTTP server running on port 3333"));
