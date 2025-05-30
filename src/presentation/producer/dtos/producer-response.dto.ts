import { ApiProperty } from '@nestjs/swagger';

export class FarmResponseDto {
  @ApiProperty({ example: '7f7f435b-c0bb-456c-aa4a-40ec2af4021a' })
  id: string;

  @ApiProperty({ example: 'Fazenda Boa Vista' })
  name: string;

  @ApiProperty({ example: 'GO' })
  state: string;

  @ApiProperty({ example: 100 })
  totalArea: number;

  @ApiProperty({ example: 60 })
  arableArea: number;

  @ApiProperty({ example: 40 })
  vegetationArea: number;

  @ApiProperty({ example: ['Soja', 'Milho'] })
  crops: string[];
}

export class ProducerResponseDto {
  @ApiProperty({ example: '43e30055-9619-46f1-b4b4-4c919d02814e' })
  id: string;

  @ApiProperty({ example: 'João da Silva' })
  name: string;

  @ApiProperty({ example: '12345678909' })
  document: string;

  @ApiProperty({ type: [FarmResponseDto] })
  farms: FarmResponseDto[];
}
