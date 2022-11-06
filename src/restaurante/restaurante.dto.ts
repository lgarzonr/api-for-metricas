import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RestauranteDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
}
