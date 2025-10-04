-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Garden" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "img_url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tamanho_m2" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_comum" TEXT NOT NULL,
    "nome_cientifico" TEXT NOT NULL,
    "umidade_min" INTEGER NOT NULL,
    "umidade_max" INTEGER NOT NULL,
    "temp_min" INTEGER NOT NULL,
    "temp_max" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "PlantGarden" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plantId" INTEGER NOT NULL,
    "gardenId" TEXT NOT NULL,
    "quant" INTEGER NOT NULL,
    "data_plantio" DATETIME NOT NULL,
    CONSTRAINT "PlantGarden_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlantGarden_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "Garden" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Irrigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "volume" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "gardenId" TEXT NOT NULL,
    "irrigationHistoryId" TEXT,
    CONSTRAINT "Irrigation_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "Garden" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Irrigation_irrigationHistoryId_fkey" FOREIGN KEY ("irrigationHistoryId") REFERENCES "IrrigationHistory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IrrigationHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gardenId" TEXT NOT NULL,
    "temperature" INTEGER NOT NULL,
    "humidity" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL,
    CONSTRAINT "IrrigationHistory_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "Garden" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Plant_nome_cientifico_key" ON "Plant"("nome_cientifico");

-- CreateIndex
CREATE UNIQUE INDEX "Irrigation_irrigationHistoryId_key" ON "Irrigation"("irrigationHistoryId");
