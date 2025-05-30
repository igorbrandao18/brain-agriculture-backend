export class RuralProducer {
  constructor(
    public readonly id: string,
    public name: string,
    public document: string, // CPF ou CNPJ
    public properties: any[] = [],
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {
    this.validateDocument();
  }

  private validateDocument() {
    if (!this.isValidCPF(this.document) && !this.isValidCNPJ(this.document)) {
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

  addProperty(property: any) {
    this.properties.push(property);
  }
} 