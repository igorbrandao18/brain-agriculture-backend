export class PlantedCrop {
  constructor(
    public readonly id: string,
    public name: string,
    public area: number,
    public harvestId: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
