export class RuralProperty {
  constructor(
    public readonly id: string,
    public name: string,
    public state: string,
    public city: string,
    public totalArea: number,
    public arableArea: number,
    public vegetationArea: number,
    public producerId: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {
    this.validateAreas();
  }

  private validateAreas() {
    if (this.arableArea + this.vegetationArea > this.totalArea) {
      throw new Error(
        'A soma das áreas agricultáveis e de vegetação não pode exceder a área total.',
      );
    }
  }
}
