export class Harvest {
  constructor(
    public readonly id: string,
    public year: number,
    public propertyId: string,
    public plantedCrops: any[] = [],
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  addPlantedCrop(crop: any) {
    this.plantedCrops.push(crop);
  }
} 