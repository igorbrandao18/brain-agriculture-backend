import { RuralProducer } from '../domain/rural-producer.entity';
import { IRuralProducerRepository } from '../ports/rural-producer.repository';
import { Logger } from '@nestjs/common';

export interface UpdateRuralProducerDTO {
  id: string;
  name?: string;
  document?: string;
}

export class UpdateRuralProducerUseCase {
  private readonly logger = new Logger(UpdateRuralProducerUseCase.name);
  constructor(private readonly repository: IRuralProducerRepository) {}

  async execute(data: UpdateRuralProducerDTO): Promise<RuralProducer> {
    try {
      const producer = await this.repository.findById(data.id);
      if (!producer) {
        this.logger.warn(`Produtor não encontrado: ${data.id}`);
        throw new Error('Produtor rural não encontrado.');
      }
      if (data.name) producer.name = data.name;
      if (data.document) producer.document = data.document;
      // Validação de documento ocorre no setter
      await this.repository.update(producer);
      this.logger.log(`Produtor atualizado com sucesso: ${producer.id}`);
      return producer;
    } catch (error) {
      const errorMsg =
        typeof error === 'object' && error && 'message' in error
          ? String((error as Record<string, unknown>).message)
          : String(error);
      if (errorMsg === 'Produtor rural não encontrado.') {
        throw new (await import('@nestjs/common')).HttpException(errorMsg, 404);
      }
      this.logger.error(`Erro ao atualizar produtor: ${errorMsg}`);
      throw error;
    }
  }
}
