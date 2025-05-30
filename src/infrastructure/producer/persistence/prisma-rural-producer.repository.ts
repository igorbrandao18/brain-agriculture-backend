import { Inject, Injectable } from '@nestjs/common';
import { IRuralProducerRepository } from '../../../core/producer/ports/rural-producer.repository';
import { RuralProducer } from '../../../core/producer/domain/rural-producer.entity';
import { RuralProperty } from '../../../core/producer/domain/rural-property.entity';
import { Harvest } from '../../../core/producer/domain/harvest.entity';
import { PlantedCrop } from '../../../core/producer/domain/planted-crop.entity';
import { PrismaClient } from '@prisma/client';
import { PRISMA_CLIENT } from '../../database/database.module';

@Injectable()
export class PrismaRuralProducerRepository implements IRuralProducerRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async create(producer: RuralProducer): Promise<void> {
    await this.prisma.ruralProducer.create({
      data: {
        id: producer.id,
        name: producer.name,
        document: producer.document,
        createdAt: producer.createdAt,
        updatedAt: producer.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<RuralProducer | null> {
    const data = await this.prisma.ruralProducer.findUnique({ where: { id } });
    if (!data) return null;
    return new RuralProducer(
      data.id,
      data.name,
      data.document,
      [],
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
    await this.prisma.ruralProducer.delete({ where: { id } });
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
                prop.city,
                prop.totalArea,
                prop.arableArea,
                prop.vegetationArea,
                prop.producerId,
                prop.createdAt,
                prop.updatedAt,
              )
          ),
          item.createdAt,
          item.updatedAt,
        ),
    );
  }
}