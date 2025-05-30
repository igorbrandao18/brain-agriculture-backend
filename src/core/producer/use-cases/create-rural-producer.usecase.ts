import { RuralProducer } from '../domain/rural-producer.entity';
import { PrismaRuralProducerRepository } from '../../../infrastructure/producer/persistence/prisma-rural-producer.repository';
import { v4 as uuidv4 } from 'uuid';

export interface CreateRuralProducerDTO {
  name: string;
  document: string;
}

export class CreateRuralProducerUseCase {
  constructor(private readonly repository: PrismaRuralProducerRepository) {}

  async execute(data: CreateRuralProducerDTO): Promise<RuralProducer> {
    const producer = new RuralProducer(
      uuidv4(),
      data.name,
      data.document,
      [],
      new Date(),
      new Date(),
    );
    await this.repository.create(producer);
    return producer;
  }
} 