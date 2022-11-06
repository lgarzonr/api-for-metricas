import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { CulturaProductoService } from './cultura-producto.service';
import { CulturaProductoController } from './cultura-producto.controller';
import { CulturaProductoResolver } from './cultura-producto.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([CulturaEntity, ProductoEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 10,
      },
    }),
  ],
  providers: [CulturaProductoService, CulturaProductoResolver],
  controllers: [CulturaProductoController],
})
export class CulturaProductoModule {}
