import { IRuralProducerRepository } from '../ports/rural-producer.repository';
import { Logger } from '@nestjs/common';
import { Harvest } from '../domain/harvest.entity';

export interface DashboardData {
  totalFarms: number;
  totalHectares: number;
  byState: { state: string; count: number }[];
  byCrop: { crop: string; count: number }[];
  landUse: { type: string; total: number }[];
}

export class DashboardUseCase {
  private readonly logger = new Logger(DashboardUseCase.name);
  constructor(private readonly repository: IRuralProducerRepository) {}

  async execute(): Promise<DashboardData> {
    this.logger.log('Iniciando agregação de dados do dashboard');
    try {
      const all = await this.repository.findAll();
      let totalFarms = 0;
      let totalHectares = 0;
      const stateMap = new Map<string, number>();
      const cropMap = new Map<string, number>();
      let arable = 0;
      let vegetation = 0;

      for (const producer of all) {
        for (const farm of producer.properties) {
          totalFarms += 1;
          totalHectares += farm.totalArea || 0;
          stateMap.set(farm.state, (stateMap.get(farm.state) || 0) + 1);
          arable += farm.arableArea || 0;
          vegetation += farm.vegetationArea || 0;
          const harvests = (farm as unknown as Record<string, unknown>)[
            'harvests'
          ];
          if (
            Array.isArray(harvests) &&
            harvests[0] &&
            Array.isArray((harvests[0] as Harvest).plantedCrops)
          ) {
            for (const crop of (harvests[0] as Harvest).plantedCrops) {
              cropMap.set(crop.name, (cropMap.get(crop.name) || 0) + 1);
            }
          }
        }
      }
      this.logger.log('Agregação de dados do dashboard concluída com sucesso');
      return {
        totalFarms,
        totalHectares,
        byState: Array.from(stateMap.entries()).map(([state, count]) => ({
          state,
          count,
        })),
        byCrop: Array.from(cropMap.entries()).map(([crop, count]) => ({
          crop,
          count,
        })),
        landUse: [
          { type: 'arable', total: arable },
          { type: 'vegetation', total: vegetation },
        ],
      };
    } catch (error) {
      const errorMsg =
        typeof error === 'object' && error && 'message' in error
          ? String((error as Record<string, unknown>).message)
          : String(error);
      this.logger.error(`Erro ao gerar dashboard: ${errorMsg}`);
      throw error;
    }
  }
}
