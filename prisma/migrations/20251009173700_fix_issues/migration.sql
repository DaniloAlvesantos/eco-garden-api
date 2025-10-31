/*
  Warnings:

  - You are about to drop the column `img_url` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `tamanho_m2` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `nome_cientifico` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `nome_comum` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `temp_max` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `temp_min` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `umidade_max` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `umidade_min` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `data_plantio` on the `PlantGarden` table. All the data in the column will be lost.
  - Added the required column `imgUrl` to the `Garden` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tamanhoM2` to the `Garden` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeCientifico` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeComum` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempMax` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempMin` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `umidadeMax` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `umidadeMin` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataPlantio` to the `PlantGarden` table without a default value. This is not possible if the table is not empty.

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
    "imgUrl" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tamanhoM2" INTEGER NOT NULL,
    "irrigationHistoryId" TEXT NOT NULL,
    CONSTRAINT "Garden_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Garden_irrigationHistoryId_fkey" FOREIGN KEY ("irrigationHistoryId") REFERENCES "IrrigationHistory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Garden" ("cep", "createdAt", "id", "irrigationHistoryId", "lat", "lng", "name", "number", "userId") SELECT "cep", "createdAt", "id", "irrigationHistoryId", "lat", "lng", "name", "number", "userId" FROM "Garden";
DROP TABLE "Garden";
ALTER TABLE "new_Garden" RENAME TO "Garden";
CREATE UNIQUE INDEX "Garden_irrigationHistoryId_key" ON "Garden"("irrigationHistoryId");
CREATE INDEX "Garden_userId_idx" ON "Garden"("userId");
CREATE UNIQUE INDEX "Garden_lat_lng_key" ON "Garden"("lat", "lng");
CREATE UNIQUE INDEX "Garden_cep_number_key" ON "Garden"("cep", "number");
CREATE TABLE "new_Irrigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "temperature" INTEGER NOT NULL,
    "humidity" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "volume" REAL NOT NULL,
    "irrigationHistoryId" TEXT NOT NULL,
    CONSTRAINT "Irrigation_irrigationHistoryId_fkey" FOREIGN KEY ("irrigationHistoryId") REFERENCES "IrrigationHistory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Irrigation" ("humidity", "id", "irrigationHistoryId", "temperature", "timestamp", "volume") SELECT "humidity", "id", "irrigationHistoryId", "temperature", "timestamp", "volume" FROM "Irrigation";
DROP TABLE "Irrigation";
ALTER TABLE "new_Irrigation" RENAME TO "Irrigation";
CREATE INDEX "Irrigation_irrigationHistoryId_idx" ON "Irrigation"("irrigationHistoryId");
CREATE INDEX "Irrigation_timestamp_idx" ON "Irrigation"("timestamp");
CREATE TABLE "new_Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeComum" TEXT NOT NULL,
    "nomeCientifico" TEXT NOT NULL,
    "umidadeMin" INTEGER NOT NULL,
    "umidadeMax" INTEGER NOT NULL,
    "tempMin" INTEGER NOT NULL,
    "tempMax" INTEGER NOT NULL
);
INSERT INTO "new_Plant" ("id") SELECT "id" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
CREATE UNIQUE INDEX "Plant_nomeCientifico_key" ON "Plant"("nomeCientifico");
CREATE INDEX "Plant_nomeCientifico_idx" ON "Plant"("nomeCientifico");
CREATE TABLE "new_PlantGarden" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plantId" INTEGER NOT NULL,
    "gardenId" TEXT NOT NULL,
    "quant" INTEGER NOT NULL,
    "dataPlantio" DATETIME NOT NULL,
    CONSTRAINT "PlantGarden_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlantGarden_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "Garden" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlantGarden" ("gardenId", "id", "plantId", "quant") SELECT "gardenId", "id", "plantId", "quant" FROM "PlantGarden";
DROP TABLE "PlantGarden";
ALTER TABLE "new_PlantGarden" RENAME TO "PlantGarden";
CREATE INDEX "PlantGarden_plantId_idx" ON "PlantGarden"("plantId");
CREATE INDEX "PlantGarden_gardenId_idx" ON "PlantGarden"("gardenId");
CREATE UNIQUE INDEX "PlantGarden_plantId_gardenId_key" ON "PlantGarden"("plantId", "gardenId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");
