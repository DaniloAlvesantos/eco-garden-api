import type { FastifyTypedInstance } from "../types";
import { z } from "zod";
import { mockSensor } from "../utils/mockSensor";
import { getCurrentWeather } from "../utils/getCurrentWeather";

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

      const weather = await getCurrentWeather({ q: { city: "Itapira" } });
      const degree = weather!.current.temp_c;

      await mockSensor(gardenId, degree);

      return res.send({ success: true }).code(201);
    }
  );
}
