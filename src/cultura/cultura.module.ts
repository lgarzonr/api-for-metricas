import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from './cultura.entity';
import { CulturaService } from './cultura.service';
import { CulturaController } from './cultura.controller';
import { CulturaResolver } from './cultura.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([CulturaEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 10,
      },
    }),
  ],
  providers: [CulturaService, CulturaResolver],
  controllers: [CulturaController],
})
export class CulturaModule {}
