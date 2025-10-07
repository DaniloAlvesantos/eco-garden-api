/*
  Warnings:

  - A unique constraint covering the columns `[lat,lng]` on the table `Garden` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cep,number]` on the table `Garden` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Garden_lat_lng_key" ON "Garden"("lat", "lng");

-- CreateIndex
CREATE UNIQUE INDEX "Garden_cep_number_key" ON "Garden"("cep", "number");
