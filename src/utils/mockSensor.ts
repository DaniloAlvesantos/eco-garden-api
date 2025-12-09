import { firestore_db } from "../lib/firebase/admin";

export const mockSensor = async (gardenId: string, degree: number) => {
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
      humidityPercentage = currentHumidity.percentage + 25;
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

    await firestore_db
      .collection("garden")
      .doc(gardenId)
      .collection("irrigations")
      .add({
        humidity: humidityPercentage,
        temperature: degree ?? 25,
        volume: Math.round(Math.random() * 150),
        timestamp: currentTimestamp,
      });
  } catch (err) {}
};
