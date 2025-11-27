import type { IrrigationHistory } from "./irrigationHistory.collection";

export interface GardenCollection {
  name: string;
  irrigations: IrrigationHistory[];
}
