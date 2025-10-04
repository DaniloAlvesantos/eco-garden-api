/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Irrigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "volume" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "gardenId" TEXT NOT NULL,
    "irrigationHistoryId" TEXT,
    CONSTRAINT "Irrigation_irrigationHistoryId_fkey" FOREIGN KEY ("irrigationHistoryId") REFERENCES "IrrigationHistory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Irrigation" ("end_time", "gardenId", "id", "irrigationHistoryId", "start_time", "status", "volume") SELECT "end_time", "gardenId", "id", "irrigationHistoryId", "start_time", "status", "volume" FROM "Irrigation";
DROP TABLE "Irrigation";
ALTER TABLE "new_Irrigation" RENAME TO "Irrigation";
CREATE UNIQUE INDEX "Irrigation_irrigationHistoryId_key" ON "Irrigation"("irrigationHistoryId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "name", "phone") SELECT "email", "id", "name", "phone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
