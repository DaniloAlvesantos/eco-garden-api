/*
  Warnings:

  - You are about to drop the column `gardenId` on the `Irrigation` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Irrigation` table. All the data in the column will be lost.
  - You are about to drop the column `gardenId` on the `IrrigationHistory` table. All the data in the column will be lost.
  - Added the required column `irrigationHistoryId` to the `Garden` table without a default value. This is not possible if the table is not empty.
  - Made the column `irrigationHistoryId` on table `Irrigation` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Garden" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "img_url" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tamanho_m2" INTEGER NOT NULL,
    "irrigationHistoryId" TEXT NOT NULL,
    CONSTRAINT "Garden_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Garden_irrigationHistoryId_fkey" FOREIGN KEY ("irrigationHistoryId") REFERENCES "IrrigationHistory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Garden" ("cep", "createdAt", "id", "img_url", "lat", "lng", "name", "number", "tamanho_m2", "userId") SELECT "cep", "createdAt", "id", "img_url", "lat", "lng", "name", "number", "tamanho_m2", "userId" FROM "Garden";
DROP TABLE "Garden";
ALTER TABLE "new_Garden" RENAME TO "Garden";
CREATE UNIQUE INDEX "Garden_irrigationHistoryId_key" ON "Garden"("irrigationHistoryId");
CREATE INDEX "Garden_userId_idx" ON "Garden"("userId");
CREATE UNIQUE INDEX "Garden_lat_lng_key" ON "Garden"("lat", "lng");
CREATE UNIQUE INDEX "Garden_cep_number_key" ON "Garden"("cep", "number");
CREATE TABLE "new_Irrigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "volume" REAL NOT NULL,
    "irrigationHistoryId" TEXT NOT NULL,
    CONSTRAINT "Irrigation_irrigationHistoryId_fkey" FOREIGN KEY ("irrigationHistoryId") REFERENCES "IrrigationHistory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Irrigation" ("end_time", "id", "irrigationHistoryId", "start_time", "volume") SELECT "end_time", "id", "irrigationHistoryId", "start_time", "volume" FROM "Irrigation";
DROP TABLE "Irrigation";
ALTER TABLE "new_Irrigation" RENAME TO "Irrigation";
CREATE INDEX "Irrigation_irrigationHistoryId_idx" ON "Irrigation"("irrigationHistoryId");
CREATE TABLE "new_IrrigationHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "temperature" INTEGER NOT NULL,
    "humidity" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL
);
INSERT INTO "new_IrrigationHistory" ("humidity", "id", "temperature", "timestamp") SELECT "humidity", "id", "temperature", "timestamp" FROM "IrrigationHistory";
DROP TABLE "IrrigationHistory";
ALTER TABLE "new_IrrigationHistory" RENAME TO "IrrigationHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
