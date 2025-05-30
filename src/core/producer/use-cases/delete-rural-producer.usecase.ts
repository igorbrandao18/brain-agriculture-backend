import { IRuralProducerRepository } from '../ports/rural-producer.repository';
import { Logger } from '@nestjs/common';

export class DeleteRuralProducerUseCase {
  private readonly logger = new Logger(DeleteRuralProducerUseCase.name);
  constructor(private readonly repository: IRuralProducerRepository) {}

  async execute(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
      this.logger.log(`Produtor removido com sucesso: ${id}`);
    } catch (error) {
      const errorMsg =
        typeof error === 'object' && error && 'message' in error
          ? String((error as Record<string, unknown>).message)
          : String(error);
      this.logger.error(`Erro ao remover produtor: ${errorMsg}`);
      throw error;
    }
  }
}
