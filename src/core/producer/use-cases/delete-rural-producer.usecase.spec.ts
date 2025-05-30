import { DeleteRuralProducerUseCase } from './delete-rural-producer.usecase';
import { IRuralProducerRepository } from '../ports/rural-producer.repository';
import { Logger } from '@nestjs/common';

const mockRepo = (): IRuralProducerRepository => ({
  create: jest.fn(() => Promise.resolve()),
  findById: jest.fn(() => Promise.resolve(null)),
  update: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
  findAll: jest.fn(() => Promise.resolve([])),
});

describe('DeleteRuralProducerUseCase', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  it('should delete a producer successfully', async () => {
    const repo = mockRepo();
    repo.delete = jest.fn().mockResolvedValue(undefined);
    const useCase = new DeleteRuralProducerUseCase(repo);
    await expect(useCase.execute('1')).resolves.toBeUndefined();
    expect(() => repo.delete('1')).not.toThrow();
  });

  it('should log and throw error if repository.delete fails', async () => {
    const repo = mockRepo();
    const error = new Error('DB error');
    repo.delete = jest.fn().mockRejectedValue(error);
    const useCase = new DeleteRuralProducerUseCase(repo);
    await expect(useCase.execute('2')).rejects.toThrow('DB error');
  });
});
