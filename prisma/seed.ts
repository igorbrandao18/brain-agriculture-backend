import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpa dados existentes
  await prisma.plantedCrop.deleteMany();
  await prisma.harvest.deleteMany();
  await prisma.ruralProperty.deleteMany();
  await prisma.ruralProducer.deleteMany();

  // Cria produtores
  await prisma.ruralProducer.create({
    data: {
      name: 'João Silva',
      document: '12345678901',
      properties: {
        create: [
          {
            name: 'Fazenda Primavera',
            state: 'SP',
            city: 'Ribeirão Preto',
            totalArea: 100,
            arableArea: 60,
            vegetationArea: 30,
            harvests: {
              create: [
                {
                  year: 2024,
                  plantedCrops: {
                    create: [
                      { name: 'Soja', area: 30 },
                      { name: 'Milho', area: 30 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    include: { properties: true },
  });

  await prisma.ruralProducer.create({
    data: {
      name: 'Fazenda Bom Futuro',
      document: '12345678000199',
      properties: {
        create: [
          {
            name: 'Fazenda Horizonte',
            state: 'MT',
            city: 'Cuiabá',
            totalArea: 200,
            arableArea: 120,
            vegetationArea: 60,
            harvests: {
              create: [
                {
                  year: 2024,
                  plantedCrops: {
                    create: [
                      { name: 'Algodão', area: 50 },
                      { name: 'Soja', area: 70 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    include: { properties: true },
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
