import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ProductoEntity {
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
  historia: string;

  @Field()
  @Column()
  tipoProducto: string;

  @Field((type) => [CulturaEntity], { nullable: true })
  @ManyToOne(() => CulturaEntity, (cultura) => cultura.recetas)
  cultura: CulturaEntity;
}
