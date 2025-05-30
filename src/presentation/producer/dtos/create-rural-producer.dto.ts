import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateRuralProducerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(11, 14, { message: 'O documento deve ter entre 11 (CPF) e 14 (CNPJ) caracteres.' })
  document: string;
} 