import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EstrellaMichellinEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numeroEstrella: number;

  @Column()
  fechaObtencion: Date;

  @ManyToOne(() => RestauranteEntity, (restaurante) => restaurante.estrellas)
  restaurante: RestauranteEntity;
}
