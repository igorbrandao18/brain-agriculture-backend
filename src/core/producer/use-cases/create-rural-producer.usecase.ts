import { IRuralProducerRepository } from '../ports/rural-producer.repository';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';
import { RuralProducer } from '../domain/rural-producer.entity';
import { RuralProperty } from '../domain/rural-property.entity';
import { Harvest, PlantedCropLike } from '../domain/harvest.entity';

export interface CreateRuralProducerDTO {
  name: string;
  document: string;
  farms?: Array<{
    name: string;
    state: string;
    totalArea: number;
    arableArea: number;
    vegetationArea: number;
    crops: string[];
  }>;
}

export class CreateRuralProducerUseCase {
  private readonly logger = new Logger(CreateRuralProducerUseCase.name);
  constructor(private readonly repository: IRuralProducerRepository) {}

  async execute(data: CreateRuralProducerDTO): Promise<RuralProducer> {
    console.log('Entrou no use case de criação com:', data);
    try {
      this.logger.debug('Payload recebido para criação:', JSON.stringify(data));
      // Validação manual de documento
      if (!this.isValidCPF(data.document) && !this.isValidCNPJ(data.document)) {
        throw new Error('Documento inválido: deve ser um CPF ou CNPJ válido.');
      }
      // Garante que farms é array
      const farms = Array.isArray(data.farms) ? data.farms : [];
      // Cria o produtor
      const producer = new RuralProducer(
        uuidv4(),
        data.name,
        data.document,
        farms.map((farm) => {
          const ruralProperty = new RuralProperty(
            uuidv4(),
            farm.name,
            farm.state,
            'city' in farm && typeof farm.city === 'string' ? farm.city : '',
            farm.totalArea,
            farm.arableArea,
            farm.vegetationArea,
            '', // producerId será preenchido pelo ORM
            new Date(),
            new Date(),
          );
          // Se vier crops, cria um harvest para o ano atual
          if (Array.isArray(farm.crops) && farm.crops.length > 0) {
            const plantedCrops: PlantedCropLike[] = farm.crops.map(
              (cropName) => ({
                id: uuidv4(),
                name: cropName,
                area: 0,
              }),
            );
            const harvest = new Harvest(
              uuidv4(),
              new Date().getFullYear(),
              ruralProperty.id,
              plantedCrops,
              new Date(),
              new Date(),
            );
            (ruralProperty as unknown as { harvests?: Harvest[] }).harvests = [
              harvest,
            ];
          }
          return ruralProperty;
        }),
        new Date(),
        new Date(),
      );
      console.log('Antes de persistir producer:', producer);
      await this.repository.create(producer);
      console.log('Depois de persistir producer');
      this.logger.log(`Produtor criado com sucesso: ${producer.id}`);
      return producer;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        typeof (error as Record<string, unknown>).status === 'number' &&
        (error as Record<string, unknown>).status === 409
      ) {
        throw error;
      }
      if (error instanceof Error) {
        console.error('Erro ao criar produtor:', error.message);
        console.error('Stack trace:', error.stack);
        console.error('Erro completo:', error);
      } else {
        console.error('Erro desconhecido ao criar produtor:', error);
      }
      throw error;
    }
  }

  private isValidCPF(cpf: string): boolean {
    return cpf.length === 11;
  }

  private isValidCNPJ(cnpj: string): boolean {
    return cnpj.length === 14;
  }
}
