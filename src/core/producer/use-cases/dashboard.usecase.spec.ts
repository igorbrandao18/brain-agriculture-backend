import { DashboardUseCase } from './dashboard.usecase';
import { IRuralProducerRepository } from '../ports/rural-producer.repository';
import { Logger } from '@nestjs/common';

const mockRepo = (producers: any[]): IRuralProducerRepository => ({
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn().mockResolvedValue(producers),
});

describe('DashboardUseCase', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  it('should aggregate dashboard data correctly', async () => {
    const producers = [
      {
        properties: [
          {
            totalArea: 100,
            arableArea: 60,
            vegetationArea: 40,
            state: 'GO',
            harvests: [{ plantedCrops: [{ name: 'Soja' }, { name: 'Milho' }] }],
          },
          {
            totalArea: 50,
            arableArea: 30,
            vegetationArea: 20,
            state: 'MT',
            harvests: [{ plantedCrops: [{ name: 'Soja' }] }],
          },
        ],
      },
      {
        properties: [
          {
            totalArea: 80,
            arableArea: 50,
            vegetationArea: 30,
            state: 'GO',
            harvests: [{ plantedCrops: [{ name: 'Milho' }] }],
          },
        ],
      },
    ];
    const repo = mockRepo(producers);
    const useCase = new DashboardUseCase(repo);
    const result = await useCase.execute();
    expect(result.totalFarms).toBe(3); // 3 propriedades
    expect(result.totalHectares).toBe(230); // 100+50+80
    expect(result.byState).toEqual(
      expect.arrayContaining([
        { state: 'GO', count: 2 },
        { state: 'MT', count: 1 },
      ]),
    );
    expect(result.byCrop).toEqual(
      expect.arrayContaining([
        { crop: 'Soja', count: 2 },
        { crop: 'Milho', count: 2 },
      ]),
    );
    expect(result.landUse).toEqual(
      expect.arrayContaining([
        { type: 'arable', total: 140 },
        { type: 'vegetation', total: 90 },
      ]),
    );
  });
});
