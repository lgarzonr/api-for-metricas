import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CulturaDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;
}
