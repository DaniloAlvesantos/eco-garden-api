import type { Timestamp } from "firebase-admin/firestore";

interface BaseSensorData {
  timestamp: Timestamp;
  value: number;
}

export interface HumiditySensorData extends BaseSensorData {
  type: "HUMIDITY";
  percentage: number;
}

export interface WaterLevelSensorData extends BaseSensorData {
  type: "WATER_LEVEL";
  depth_cm: number;
}

export type SensorData = HumiditySensorData | WaterLevelSensorData;
