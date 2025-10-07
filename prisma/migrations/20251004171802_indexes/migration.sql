/*
  Warnings:

  - Added the required column `cep` to the `Garden` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Garden` table without a default value. This is not possible if the table is not empty.

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
    CONSTRAINT "Garden_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Garden" ("createdAt", "id", "img_url", "lat", "lng", "name", "tamanho_m2", "userId") SELECT "createdAt", "id", "img_url", "lat", "lng", "name", "tamanho_m2", "userId" FROM "Garden";
DROP TABLE "Garden";
ALTER TABLE "new_Garden" RENAME TO "Garden";
CREATE INDEX "Garden_userId_idx" ON "Garden"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Irrigation_irrigationHistoryId_idx" ON "Irrigation"("irrigationHistoryId");

-- CreateIndex
CREATE INDEX "IrrigationHistory_gardenId_idx" ON "IrrigationHistory"("gardenId");

-- CreateIndex
CREATE INDEX "PlantGarden_plantId_gardenId_idx" ON "PlantGarden"("plantId", "gardenId");
