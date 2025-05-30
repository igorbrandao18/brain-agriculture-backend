import { PrismaRuralProducerRepository } from '../../../infrastructure/producer/persistence/prisma-rural-producer.repository';

export class DeleteRuralProducerUseCase {
  constructor(private readonly repository: PrismaRuralProducerRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 