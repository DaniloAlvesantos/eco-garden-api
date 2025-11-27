import { Timestamp } from "firebase-admin/firestore";
import { firestore_db } from "../lib/firebase/admin.js";
import { type SensorData } from "../@types/collections/sensor.collection.js";

interface SensorDataProps extends Omit<SensorData, "timestamp"> {
  gardenId: string;
}

export async function recordSensorData(data: SensorDataProps): Promise<string> {
  const { gardenId, ...sensorData } = data;

  const sensorCollectionRef = firestore_db
    .collection("garden")
    .doc(gardenId)
    .collection("sensor");

  const sensorReading = {
    ...sensorData,
    timestamp: Timestamp.now(),
  };

  try {
    const newDocRef = await sensorCollectionRef.add(sensorReading);

    console.log(
      `Novo documento de sensor (${data.type}) criado com ID:`,
      newDocRef.id
    );
    return newDocRef.id;
  } catch (error) {
    console.error("Erro ao adicionar documento de sensor:", error);
    throw error;
  }
}
