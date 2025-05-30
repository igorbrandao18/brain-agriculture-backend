/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `RuralProducer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RuralProducer_document_key" ON "RuralProducer"("document");
