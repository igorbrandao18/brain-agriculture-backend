import { ApiProperty } from '@nestjs/swagger';

export class ByStateDto {
  @ApiProperty({ example: 'GO' })
  state: string;
  @ApiProperty({ example: 5 })
  count: number;
}

export class ByCropDto {
  @ApiProperty({ example: 'Soja' })
  crop: string;
  @ApiProperty({ example: 800 })
  count: number;
}

export class LandUseDto {
  @ApiProperty({
    example: 'arable',
    description: 'Tipo de uso do solo: arable ou vegetation',
  })
  type: string;
  @ApiProperty({ example: 900 })
  total: number;
}

export class DashboardResponseDto {
  @ApiProperty({ example: 10 })
  totalFarms: number;

  @ApiProperty({ example: 1500 })
  totalHectares: number;

  @ApiProperty({ type: [ByStateDto] })
  byState: ByStateDto[];

  @ApiProperty({ type: [ByCropDto] })
  byCrop: ByCropDto[];

  @ApiProperty({ type: [LandUseDto] })
  landUse: LandUseDto[];
}
