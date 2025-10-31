import { Timestamp } from "firebase-admin/firestore";
import { firestore_db } from "../lib/firebase/admin.js";

interface recordIrrigationEventProps {
  gardenId: string;
  humidity: number;
  temperature: number;
  volume: number;
}

export async function recordIrrigationEvent({
  gardenId,
  humidity,
  temperature,
  volume,
}: recordIrrigationEventProps) {
  const irrigationCollectionRef = firestore_db
    .collection("garden")
    .doc(gardenId)
    .collection("irrigations");

  const irrigationData = {
    humidity: humidity,
    temperature: temperature,
    volume: volume,
    timestamp: Timestamp.now(),
  };

  try {
    const newDocRef = await irrigationCollectionRef.add(irrigationData);

    console.log("Novo documento de irrigação criado com ID:", newDocRef.id);
    return newDocRef.id;
  } catch (error) {
    console.error("Erro ao adicionar documento de irrigação:", error);
    throw error;
  }
}
