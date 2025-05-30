-- DropForeignKey
ALTER TABLE "PlantedCrop" DROP CONSTRAINT "PlantedCrop_harvestId_fkey";

-- AddForeignKey
ALTER TABLE "PlantedCrop" ADD CONSTRAINT "PlantedCrop_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
