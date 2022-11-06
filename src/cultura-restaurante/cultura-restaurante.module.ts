import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from 'src/cultura/cultura.entity';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity';
import { CulturaRestauranteService } from './cultura-restaurante.service';
import { CulturaRestauranteController } from './cultura-restaurante.controller';
import { CulturaRestauranteResolver } from './cultura-restaurante.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([CulturaEntity, RestauranteEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 10,
      },
    }),
  ],
  providers: [CulturaRestauranteService, CulturaRestauranteResolver],
  controllers: [CulturaRestauranteController],
})
export class CulturaRestauranteModule {}
