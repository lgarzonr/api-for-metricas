import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';
import { PaisEntity } from '../../pais/pais.entity';
import { CulturaEntity } from '../../cultura/cultura.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { ProductoEntity } from '../../producto/producto.entity';
import { EstrellaMichellinEntity } from '../../estrella-michellin/estrella-michellin.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      CulturaEntity,
      RecetaEntity,
      RestauranteEntity,
      EstrellaMichellinEntity,
      PaisEntity,
      ProductoEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CulturaEntity,
    RecetaEntity,
    RestauranteEntity,
    EstrellaMichellinEntity,
    PaisEntity,
    ProductoEntity,
  ]),
];
