-- DropForeignKey
ALTER TABLE "Harvest" DROP CONSTRAINT "Harvest_propertyId_fkey";

-- AddForeignKey
ALTER TABLE "Harvest" ADD CONSTRAINT "Harvest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "RuralProperty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
