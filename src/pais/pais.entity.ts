import { CulturaEntity } from '../cultura/cultura.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaisEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  descripcion: string;

  @ManyToOne(() => CulturaEntity, (cultura) => cultura.paises)
  culturas: CulturaEntity[];
}
