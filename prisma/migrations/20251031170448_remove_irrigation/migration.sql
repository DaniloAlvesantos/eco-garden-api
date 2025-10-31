/*
  Warnings:

  - You are about to drop the `Irrigation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IrrigationHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `irrigationHistoryId` on the `Garden` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Irrigation_timestamp_idx";

-- DropIndex
DROP INDEX "Irrigation_irrigationHistoryId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Irrigation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "IrrigationHistory";
PRAGMA foreign_keys=on;

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
    CONSTRAINT "Garden_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Garden" ("cep", "createdAt", "id", "imgUrl", "lat", "lng", "name", "number", "tamanhoM2", "userId") SELECT "cep", "createdAt", "id", "imgUrl", "lat", "lng", "name", "number", "tamanhoM2", "userId" FROM "Garden";
DROP TABLE "Garden";
ALTER TABLE "new_Garden" RENAME TO "Garden";
CREATE INDEX "Garden_userId_idx" ON "Garden"("userId");
CREATE UNIQUE INDEX "Garden_lat_lng_key" ON "Garden"("lat", "lng");
CREATE UNIQUE INDEX "Garden_cep_number_key" ON "Garden"("cep", "number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
