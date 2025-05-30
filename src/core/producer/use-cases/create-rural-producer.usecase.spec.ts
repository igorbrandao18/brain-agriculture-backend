import { CreateRuralProducerUseCase } from './create-rural-producer.usecase';
import { IRuralProducerRepository } from '../ports/rural-producer.repository';
import { Logger } from '@nestjs/common';

const mockRepo = (): IRuralProducerRepository => ({
  create: async () => Promise.resolve(),
  findById: async () => Promise.resolve(null),
  update: async () => Promise.resolve(),
  delete: async () => Promise.resolve(),
  findAll: async () => Promise.resolve([]),
});

describe('CreateRuralProducerUseCase', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  it('should create a valid producer with CPF and call repository', async () => {
    const repo = mockRepo();
    const useCase = new CreateRuralProducerUseCase(repo);
    const dto = { name: 'João', document: '12345678901' };
    const spy = jest.spyOn(repo, 'create');
    await useCase.execute(dto);
    expect(spy).toHaveBeenCalled();
  });

  it('should create a valid producer with CNPJ and call repository', async () => {
    const repo = mockRepo();
    const useCase = new CreateRuralProducerUseCase(repo);
    const dto = { name: 'Empresa', document: '12345678901234' };
    const spy = jest.spyOn(repo, 'create');
    await useCase.execute(dto);
    expect(spy).toHaveBeenCalled();
  });

  it('should throw error for invalid document', async () => {
    const repo = mockRepo();
    const useCase = new CreateRuralProducerUseCase(repo);
    const dto = { name: 'Inválido', document: '123' };
    await expect(useCase.execute(dto)).rejects.toThrow(
      'Documento inválido: deve ser um CPF ou CNPJ válido.',
    );
  });
});
