import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { RestauranteController } from './restaurante.controller';
import * as sqliteStore from 'cache-manager-sqlite';
import { RestauranteResolver } from './restaurante.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestauranteEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 10,
      },
    }),
  ],
  providers: [RestauranteService, RestauranteResolver],
  controllers: [RestauranteController],
})
export class RestauranteModule {}
