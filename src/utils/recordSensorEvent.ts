import { Timestamp } from "firebase-admin/firestore";
import { firestore_db } from "../lib/firebase/admin.js";
import { type SensorData } from "../@types/collections/sensor.collection.js";

interface HumiditySensorDataProps {
  gardenId: string;
  type: "HUMIDITY";
  percentage: number;
}

interface WaterLevelSensorDataProps {
  gardenId: string;
  type: "WATER_LEVEL";
  depth_cm: number;
}

export type SensorDataProps =
  | HumiditySensorDataProps
  | WaterLevelSensorDataProps;

export async function recordSensorData(data: SensorDataProps): Promise<string> {
  const { gardenId } = data;

  const sensorCollectionRef = firestore_db
    .collection("garden")
    .doc(gardenId)
    .collection("sensor");

  const docName = data.type === "HUMIDITY" ? "HUMIDITY_0" : "WATER_LEVEL_0";

  let sensorReading: SensorData;

  if (data.type === "HUMIDITY") {
    sensorReading = {
      type: "HUMIDITY",
      timestamp: Timestamp.now(),
      percentage: data.percentage,
    };
  } else {
    sensorReading = {
      type: "WATER_LEVEL",
      timestamp: Timestamp.now(),
      depth_cm: data.depth_cm,
    };
  }

  try {
    await sensorCollectionRef.doc(docName).set(sensorReading);
    console.log(`Documento de sensor (${data.type}) criado: ${docName}`);
    return docName;
  } catch (error) {
    console.error("Erro ao adicionar documento de sensor:", error);
    throw error;
  }
}
