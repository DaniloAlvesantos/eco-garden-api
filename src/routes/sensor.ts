import type { FastifyTypedInstance } from "../types";
import { z } from "zod";
import { mockSensor } from "../utils/mockSensor";

export async function SensorRoute(app: FastifyTypedInstance) {
  app.post(
    "/sensor/event",
    {
      schema: {
        tags: ["sensor"],
        description: "Create a new sensor event",
        body: z.object({
          gardenId: z.string(),
        }),
      },
    },
    async (req, res) => {
      const { gardenId } = req.body;

      await mockSensor(gardenId);

      return res.send({ success: true }).code(201);
    }
  );
}
