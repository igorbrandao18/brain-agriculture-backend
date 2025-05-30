-- DropForeignKey
ALTER TABLE "RuralProperty" DROP CONSTRAINT "RuralProperty_producerId_fkey";

-- AddForeignKey
ALTER TABLE "RuralProperty" ADD CONSTRAINT "RuralProperty_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "RuralProducer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
