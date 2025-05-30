import { RuralProducer } from '../domain/rural-producer.entity';
import { PrismaRuralProducerRepository } from '../../../infrastructure/producer/persistence/prisma-rural-producer.repository';

export interface UpdateRuralProducerDTO {
  id: string;
  name?: string;
  document?: string;
}

export class UpdateRuralProducerUseCase {
  constructor(private readonly repository: PrismaRuralProducerRepository) {}

  async execute(data: UpdateRuralProducerDTO): Promise<RuralProducer> {
    const producer = await this.repository.findById(data.id);
    if (!producer) {
      throw new Error('Produtor rural não encontrado.');
    }
    if (data.name) producer.name = data.name;
    if (data.document) producer.document = data.document;
    // Validação de documento ocorre no setter
    await this.repository.update(producer);
    return producer;
  }
} 