/*
  Warnings:

  - You are about to drop the column `responsavel` on the `Garden` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Garden` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Irrigation_irrigationHistoryId_key";

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tamanho_m2" INTEGER NOT NULL,
    CONSTRAINT "Garden_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Garden" ("createdAt", "id", "img_url", "lat", "lng", "name", "tamanho_m2") SELECT "createdAt", "id", "img_url", "lat", "lng", "name", "tamanho_m2" FROM "Garden";
DROP TABLE "Garden";
ALTER TABLE "new_Garden" RENAME TO "Garden";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
