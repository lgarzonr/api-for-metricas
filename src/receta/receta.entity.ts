import { CulturaEntity } from '../cultura/cultura.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RecetaEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field()
  @Column()
  fotoPlato: string;

  @Field()
  @Column()
  videoPreparacion: string;

  @Field()
  @Column()
  preparacion: string;

  @Field(() => CulturaEntity, { nullable: true })
  @ManyToOne(() => CulturaEntity, (cultura) => cultura.productos)
  cultura: CulturaEntity;
}
