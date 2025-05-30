export interface PlantedCropLike {
  id: string;
  name: string;
  area: number;
}

export class Harvest {
  constructor(
    public readonly id: string,
    public year: number,
    public propertyId: string,
    public plantedCrops: PlantedCropLike[] = [],
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  addPlantedCrop(crop: PlantedCropLike) {
    this.plantedCrops.push(crop);
  }
}
