import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@InputType()
export class RecetaDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  readonly fotoPlato: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  readonly videoPreparacion: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly preparacion: string;
}
