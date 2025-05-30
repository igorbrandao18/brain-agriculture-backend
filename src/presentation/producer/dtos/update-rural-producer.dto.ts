import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateRuralProducerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Length(11, 14, {
    message: 'O documento deve ter entre 11 (CPF) e 14 (CNPJ) caracteres.',
  })
  document?: string;
}
