import { CulturaEntity } from '../cultura/cultura.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstrellaMichellinEntity } from '../estrella-michellin/estrella-michellin.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RestauranteEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field(() => [CulturaEntity], { nullable: true })
  @ManyToMany(() => CulturaEntity, (cultura) => cultura.restaurantes)
  culturas: CulturaEntity[];

  @OneToMany(() => EstrellaMichellinEntity, (estrella) => estrella.restaurante)
  estrellas: EstrellaMichellinEntity[];
}
