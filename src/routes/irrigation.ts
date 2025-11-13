import type { FastifyTypedInstance } from "../types";
import { z } from "zod";

export async function IrrigationRoute(app: FastifyTypedInstance) {
  app.get(
    "/irrigation/:id",
    {
      schema: {
        tags: ["irrigation"],
        description: "Get a garden's irrigation by id",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (req, res) => {}
  );
}
