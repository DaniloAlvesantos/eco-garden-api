import { firestore_db } from "../lib/firebase/admin";

export const mockSensor = async (gardenId: string) => {
  try {
    const humidityRef = firestore_db
      .collection("garden")
      .doc(gardenId)
      .collection("sensor")
      .doc(`HUMIDITY_0`);

    const waterLevelRef = firestore_db
      .collection("garden")
      .doc(gardenId)
      .collection("sensor")
      .doc(`WATER_LEVEL_0`);

    const currentTimestamp = new Date();

    const currentHumidity = (await humidityRef.get()).data();
    const currentWaterLevel = (await waterLevelRef.get()).data();

    let humidityPercentage = Math.round(Math.random() * (80 - 40) + 40);
    let waterLevelPercentage = Math.round(Math.random() * (95 - 10) + 10);

    if (currentHumidity?.percentage !== undefined) {
      humidityPercentage = Math.min(
        humidityPercentage,
        currentHumidity.percentage - 1
      );
    }

    if (currentWaterLevel?.depth_cm !== undefined) {
      waterLevelPercentage = Math.min(
        waterLevelPercentage,
        currentWaterLevel.depth_cm - 1
      );
    }

    const humidityPayload = {
      percentage: humidityPercentage,
      timestamp: currentTimestamp,
      type: "HUMIDITY",
    };

    const waterLevelPayload = {
      depth_cm: waterLevelPercentage,
      timestamp: currentTimestamp,
      type: "WATER_LEVEL",
    };

    await Promise.all([
      humidityRef.update(humidityPayload),
      waterLevelRef.update(waterLevelPayload),
    ]);
  } catch (err) {}
};
