import { RuralProducer } from './rural-producer.entity';

describe('RuralProducer Entity', () => {
  it('should create a valid producer with CPF', () => {
    const producer = new RuralProducer('1', 'João', '12345678901');
    expect(producer.name).toBe('João');
    expect(producer.document).toBe('12345678901');
  });

  it('should create a valid producer with CNPJ', () => {
    const producer = new RuralProducer('2', 'Fazenda', '12345678000199');
    expect(producer.name).toBe('Fazenda');
    expect(producer.document).toBe('12345678000199');
  });

  it('should throw error for invalid document', () => {
    expect(() => new RuralProducer('3', 'Inválido', '123')).toThrow('Documento inválido: deve ser um CPF ou CNPJ válido.');
  });
}); 