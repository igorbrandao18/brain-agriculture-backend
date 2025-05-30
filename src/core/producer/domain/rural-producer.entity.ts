import { RuralProperty } from './rural-property.entity';

export class RuralProducer {
  constructor(
    public readonly id: string,
    public name: string,
    private _document: string, // CPF ou CNPJ
    public properties: RuralProperty[] = [],
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {
    this.validateDocument();
  }

  get document(): string {
    return this._document;
  }

  set document(value: string) {
    this._document = value;
    this.validateDocument();
  }

  private validateDocument() {
    if (!this.isValidCPF(this._document) && !this.isValidCNPJ(this._document)) {
      throw new Error('Documento inválido: deve ser um CPF ou CNPJ válido.');
    }
  }

  private isValidCPF(cpf: string): boolean {
    // Implementação simplificada para exemplo
    return cpf.length === 11;
  }

  private isValidCNPJ(cnpj: string): boolean {
    // Implementação simplificada para exemplo
    return cnpj.length === 14;
  }

  addProperty(property: RuralProperty) {
    this.properties.push(property);
  }
}
