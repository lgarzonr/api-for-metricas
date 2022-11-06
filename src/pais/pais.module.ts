import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { PaisesController } from './paises.controller';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaisEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 5,
      },
    }),
  ],
  providers: [PaisService],
  controllers: [PaisesController],
})
export class PaisModule {}
