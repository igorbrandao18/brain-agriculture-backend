import { CreateRuralProducerUseCase } from './create-rural-producer.usecase';
import { IRuralProducerRepository } from '../ports/rural-producer.repository';

const mockRepo = (): IRuralProducerRepository => ({
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
});

describe('CreateRuralProducerUseCase', () => {
  it('should create a valid producer and call repository', async () => {
    const repo = mockRepo();
    const useCase = new CreateRuralProducerUseCase(repo);
    const dto = { name: 'João', document: '12345678901' };
    await useCase.execute(dto);
    expect(repo.create).toHaveBeenCalled();
  });

  it('should throw error for invalid document', async () => {
    const repo = mockRepo();
    const useCase = new CreateRuralProducerUseCase(repo);
    const dto = { name: 'Inválido', document: '123' };
    await expect(useCase.execute(dto)).rejects.toThrow('Documento inválido: deve ser um CPF ou CNPJ válido.');
  });
}); 