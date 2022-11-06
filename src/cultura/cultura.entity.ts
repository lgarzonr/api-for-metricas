import { RecetaEntity } from '../receta/receta.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { PaisEntity } from '../pais/pais.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CulturaEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field(() => [RecetaEntity], { nullable: true })
  @OneToMany(() => RecetaEntity, (receta) => receta.cultura)
  recetas: RecetaEntity[];

  @Field(() => [ProductoEntity], { nullable: true })
  @OneToMany(() => ProductoEntity, (producto) => producto.cultura)
  productos: ProductoEntity[];

  @Field(() => [RestauranteEntity], { nullable: true })
  @ManyToMany(() => RestauranteEntity, (restaurante) => restaurante.culturas)
  @JoinTable()
  restaurantes: RestauranteEntity[];

  @OneToMany(() => PaisEntity, (pais) => pais.culturas)
  paises: PaisEntity[];
}
