import { RuralProducer } from '../domain/rural-producer.entity';

export interface IRuralProducerRepository {
  create(producer: RuralProducer): Promise<void>;
  findById(id: string): Promise<RuralProducer | null>;
  update(producer: RuralProducer): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<RuralProducer[]>;
} 