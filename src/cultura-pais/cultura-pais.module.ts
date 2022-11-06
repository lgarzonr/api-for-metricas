import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { PaisEntity } from '../pais/pais.entity';
import { CulturaPaisService } from './cultura-pais.service';
import { CulturaPaisController } from './cultura-pais.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity, PaisEntity])],
  providers: [CulturaPaisService, CulturaPaisService],
  controllers: [CulturaPaisController],
})
export class CulturaPaisModule {}
