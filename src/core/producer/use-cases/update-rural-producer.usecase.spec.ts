import { UpdateRuralProducerUseCase } from './update-rural-producer.usecase';
import { IRuralProducerRepository } from '../ports/rural-producer.repository';
import { RuralProducer } from '../domain/rural-producer.entity';
import { Logger } from '@nestjs/common';

const mockRepo = (): IRuralProducerRepository => ({
  create: jest.fn(() => Promise.resolve()),
  findById: jest.fn(() => Promise.resolve(null)),
  update: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
  findAll: jest.fn(() => Promise.resolve([])),
});

describe('UpdateRuralProducerUseCase', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
  });

  it('should update a producer successfully', async () => {
    const repo = mockRepo();
    const producer = new RuralProducer('1', 'João', '12345678901');
    repo.findById = jest.fn().mockResolvedValue(producer);
    repo.update = jest.fn();
    const useCase = new UpdateRuralProducerUseCase(repo);
    const dto = { id: '1', name: 'João Atualizado', document: '12345678901' };
    const result = await useCase.execute(dto);
    expect(result.name).toBe('João Atualizado');
  });

  it('should throw error if producer not found', async () => {
    const repo = mockRepo();
    repo.findById = jest.fn().mockResolvedValue(null);
    const useCase = new UpdateRuralProducerUseCase(repo);
    const dto = { id: '2', name: 'Não Existe', document: '12345678901' };
    await expect(useCase.execute(dto)).rejects.toThrow(
      'Produtor rural não encontrado.',
    );
  });

  it('should throw error for invalid document', async () => {
    const repo = mockRepo();
    const producer = new RuralProducer('1', 'João', '12345678901');
    repo.findById = jest.fn().mockResolvedValue(producer);
    repo.update = jest.fn();
    const useCase = new UpdateRuralProducerUseCase(repo);
    const dto = { id: '1', document: '123' };
    await expect(useCase.execute(dto)).rejects.toThrow(
      'Documento inválido: deve ser um CPF ou CNPJ válido.',
    );
  });
});
