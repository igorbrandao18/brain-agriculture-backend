import { PrismaRuralProducerRepository } from '../../../infrastructure/producer/persistence/prisma-rural-producer.repository';

export interface DashboardData {
  totalFarms: number;
  totalHectares: number;
  byState: { state: string; count: number }[];
  byCrop: { crop: string; count: number }[];
  landUse: { type: string; total: number }[];
}

export class DashboardUseCase {
  constructor(private readonly repository: PrismaRuralProducerRepository) {}

  async execute(): Promise<DashboardData> {
    // O repositório pode ser expandido para métodos agregados reais
    const all = await this.repository.findAll();
    const totalFarms = all.length;
    let totalHectares = 0;
    const stateMap = new Map<string, number>();
    const cropMap = new Map<string, number>();
    let arable = 0;
    let vegetation = 0;

    for (const producer of all) {
      for (const property of producer.properties || []) {
        totalHectares += property.totalArea || 0;
        stateMap.set(property.state, (stateMap.get(property.state) || 0) + 1);
        arable += property.arableArea || 0;
        vegetation += property.vegetationArea || 0;
        for (const harvest of property.harvests || []) {
          for (const crop of harvest.plantedCrops || []) {
            cropMap.set(crop.name, (cropMap.get(crop.name) || 0) + 1);
          }
        }
      }
    }

    return {
      totalFarms,
      totalHectares,
      byState: Array.from(stateMap.entries()).map(([state, count]) => ({ state, count })),
      byCrop: Array.from(cropMap.entries()).map(([crop, count]) => ({ crop, count })),
      landUse: [
        { type: 'arable', total: arable },
        { type: 'vegetation', total: vegetation },
      ],
    };
  }
} 