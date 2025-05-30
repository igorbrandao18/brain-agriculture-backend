import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRuralProducerRepository } from '../../../core/producer/ports/rural-producer.repository';
import { RuralProducer } from '../../../core/producer/domain/rural-producer.entity';
import { RuralProperty } from '../../../core/producer/domain/rural-property.entity';
import { PrismaClient } from '@prisma/client';
import { PRISMA_CLIENT } from '../../database/database.module';
import { Harvest } from '../../../core/producer/domain/harvest.entity';

@Injectable()
export class PrismaRuralProducerRepository implements IRuralProducerRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async create(producer: RuralProducer): Promise<void> {
    try {
      await this.prisma.ruralProducer.create({
        data: {
          id: producer.id,
          name: producer.name,
          document: producer.document,
          createdAt: producer.createdAt,
          updatedAt: producer.updatedAt,
          properties: {
            create: (producer.properties || []).map((farm) => ({
              id: farm.id,
              name: farm.name,
              state: farm.state,
              city: farm.city ?? '',
              totalArea: farm.totalArea,
              arableArea: farm.arableArea,
              vegetationArea: farm.vegetationArea,
              harvests: {
                create: Array.isArray(
                  (farm as unknown as Record<string, unknown>)['harvests'],
                )
                  ? (
                      (farm as unknown as Record<string, unknown>)[
                        'harvests'
                      ] as Harvest[]
                    ).map((harvest) => ({
                      id: harvest.id,
                      year: harvest.year,
                      plantedCrops: {
                        create: Array.isArray(harvest.plantedCrops)
                          ? harvest.plantedCrops.map((crop) => ({
                              id: crop.id,
                              name: crop.name,
                              area: crop.area,
                            }))
                          : [],
                      },
                    }))
                  : [],
              },
            })),
          },
        },
        include: {
          properties: {
            include: {
              harvests: {
                include: {
                  plantedCrops: true,
                },
              },
            },
          },
        },
      });
    } catch (error: unknown) {
      const code = getErrorProp<string>(error, 'code');
      const meta = getErrorProp<unknown>(error, 'meta');
      const target =
        meta && typeof meta === 'object' && 'target' in meta
          ? (meta as { target?: unknown }).target
          : undefined;
      if (
        code === 'P2002' &&
        Array.isArray(target) &&
        target.includes('document')
      ) {
        const err = new Error(
          'Já existe um produtor com este CPF/CNPJ',
        ) as Error & { status?: number };
        err.status = 409;
        throw err;
      }
      throw error;
    }
  }

  async findById(id: string): Promise<RuralProducer | null> {
    const data = await this.prisma.ruralProducer.findUnique({
      where: { id },
      include: {
        properties: {
          include: {
            harvests: {
              include: {
                plantedCrops: true,
              },
            },
          },
        },
      },
    });
    if (!data) return null;
    return new RuralProducer(
      data.id,
      data.name,
      data.document,
      (data.properties || []).map(
        (prop) =>
          new RuralProperty(
            prop.id,
            prop.name,
            prop.state,
            prop.city ?? '',
            prop.totalArea,
            prop.arableArea,
            prop.vegetationArea,
            prop.producerId,
            prop.createdAt,
            prop.updatedAt,
          ),
      ),
      data.createdAt,
      data.updatedAt,
    );
  }

  async update(producer: RuralProducer): Promise<void> {
    await this.prisma.ruralProducer.update({
      where: { id: producer.id },
      data: {
        name: producer.name,
        document: producer.document,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.ruralProducer.delete({ where: { id } });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error &&
        'code' in error &&
        (error as Record<string, unknown>).code === 'P2025'
      ) {
        throw new NotFoundException('Produtor rural não encontrado.');
      }
      throw error;
    }
  }

  async findAll(): Promise<RuralProducer[]> {
    const data = await this.prisma.ruralProducer.findMany({
      include: {
        properties: {
          include: {
            harvests: {
              include: {
                plantedCrops: true,
              },
            },
          },
        },
      },
    });
    return data.map(
      (item) =>
        new RuralProducer(
          item.id,
          item.name,
          item.document,
          (item.properties || []).map(
            (prop) =>
              new RuralProperty(
                prop.id,
                prop.name,
                prop.state,
                prop.city ?? '',
                prop.totalArea,
                prop.arableArea,
                prop.vegetationArea,
                prop.producerId,
                prop.createdAt,
                prop.updatedAt,
              ),
          ),
          item.createdAt,
          item.updatedAt,
        ),
    );
  }
}

function getErrorProp<T>(error: unknown, prop: string): T | undefined {
  if (typeof error === 'object' && error && prop in error) {
    return (error as Record<string, T>)[prop];
  }
  return undefined;
}
