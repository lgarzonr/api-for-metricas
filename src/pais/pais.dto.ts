import { IsNotEmpty, IsString } from 'class-validator';
export class PaisDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly codigo: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;
}
