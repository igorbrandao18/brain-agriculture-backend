import {
  IsNotEmpty,
  IsString,
  Length,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreateFarmDto {
  @ApiProperty({ example: 'Fazenda Boa Vista' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'GO', description: 'Sigla do estado' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: 100, description: 'Área total em hectares' })
  @IsNotEmpty()
  @IsNumber()
  totalArea: number;

  @ApiProperty({ example: 60, description: 'Área agricultável em hectares' })
  @IsNotEmpty()
  @IsNumber()
  arableArea: number;

  @ApiProperty({ example: 40, description: 'Área de vegetação em hectares' })
  @IsNotEmpty()
  @IsNumber()
  vegetationArea: number;

  @ApiProperty({
    example: ['Soja', 'Milho'],
    description: 'Culturas plantadas',
  })
  @IsArray()
  @IsString({ each: true })
  crops: string[];
}

export class CreateRuralProducerDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '12345678909', description: 'CPF ou CNPJ' })
  @IsNotEmpty()
  @IsString()
  @Length(11, 14, {
    message: 'O documento deve ter entre 11 (CPF) e 14 (CNPJ) caracteres.',
  })
  document: string;

  @ApiProperty({ type: [CreateFarmDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFarmDto)
  farms?: CreateFarmDto[];
}
