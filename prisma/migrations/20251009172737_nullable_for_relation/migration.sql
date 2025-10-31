/*
  Warnings:

  - You are about to drop the column `end_time` on the `Irrigation` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Irrigation` table. All the data in the column will be lost.
  - You are about to drop the column `humidity` on the `IrrigationHistory` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `IrrigationHistory` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `IrrigationHistory` table. All the data in the column will be lost.
  - Added the required column `humidity` to the `Irrigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperature` to the `Irrigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `Irrigation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Irrigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "temperature" INTEGER NOT NULL,
    "humidity" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "volume" REAL NOT NULL,
    "irrigationHistoryId" TEXT NOT NULL,
    CONSTRAINT "Irrigation_irrigationHistoryId_fkey" FOREIGN KEY ("irrigationHistoryId") REFERENCES "IrrigationHistory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Irrigation" ("id", "irrigationHistoryId", "volume") SELECT "id", "irrigationHistoryId", "volume" FROM "Irrigation";
DROP TABLE "Irrigation";
ALTER TABLE "new_Irrigation" RENAME TO "Irrigation";
CREATE INDEX "Irrigation_irrigationHistoryId_idx" ON "Irrigation"("irrigationHistoryId");
CREATE TABLE "new_IrrigationHistory" (
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_IrrigationHistory" ("id") SELECT "id" FROM "IrrigationHistory";
DROP TABLE "IrrigationHistory";
ALTER TABLE "new_IrrigationHistory" RENAME TO "IrrigationHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
