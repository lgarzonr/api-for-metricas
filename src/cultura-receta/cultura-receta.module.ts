import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from 'src/cultura/cultura.entity';
import { RecetaEntity } from 'src/receta/receta.entity';
import { CulturaRecetaService } from './cultura-receta.service';
import { CulturaRecetaController } from './cultura-receta.controller';
import { CulturaRecetaResolver } from './cultura-receta.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([CulturaEntity, RecetaEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 10,
      },
    }),
  ],
  providers: [CulturaRecetaService, CulturaRecetaResolver],
  controllers: [CulturaRecetaController],
})
export class CulturaRecetaModule {}
