import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RecetaEntity } from '../receta/receta.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaRecetaService {
  constructor(
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,

    @InjectRepository(CulturaEntity)
    private readonly culturaRepository: Repository<CulturaEntity>,

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getRecetaByRecetaId(recetaId: string) {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return receta;
  }

  async getCulturaByCulturaId(culturaId: string) {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['recetas'],
    });
    if (!cultura)
      throw new BusinessLogicException(
        'La cultura con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return cultura;
  }

  async findRecetasByCulturaId(culturaId: string): Promise<RecetaEntity[]> {
    const cacheKey = `recetas_cultura_${culturaId}`;
    const recetasCached = await this.cacheManager.get<RecetaEntity[]>(cacheKey);
    if (!recetasCached) {
      const cultura = await this.getCulturaByCulturaId(culturaId);
      await this.cacheManager.set(cacheKey, cultura.recetas);
      return cultura.recetas;
    }
    return recetasCached;
  }

  async findRecetaByCulturaIdRecetaId(
    culturaId: string,
    recetaId: string,
  ): Promise<RecetaEntity> {
    const receta = await this.getRecetaByRecetaId(recetaId);
    const cultura = await this.getCulturaByCulturaId(culturaId);

    const culturaReceta: RecetaEntity = cultura.recetas.find(
      (e) => e.id === receta.id,
    );

    if (!culturaReceta)
      throw new BusinessLogicException(
        'La receta con el id dado no esta asociada a la cultura',
        BusinessError.PRECONDITION_FAILED,
      );

    return culturaReceta;
  }

  async addRecetaCultura(
    culturaId: string,
    recetaId: string,
  ): Promise<CulturaEntity> {
    const receta = await this.getRecetaByRecetaId(recetaId);
    const cultura = await this.getCulturaByCulturaId(culturaId);

    cultura.recetas = [...cultura.recetas, receta];
    return await this.culturaRepository.save(cultura);
  }

  async associateRecetasCultura(
    culturaId: string,
    recetas: RecetaEntity[],
  ): Promise<CulturaEntity> {
    const cultura = await this.getCulturaByCulturaId(culturaId);

    for (let i = 0; i < recetas.length; i++) {
      await this.getRecetaByRecetaId(recetas[i].id);
      break;
    }

    cultura.recetas = recetas;
    return await this.culturaRepository.save(cultura);
  }

  async deleteRecetaCultura(culturaId: string, recetaId: string) {
    const receta = await this.getRecetaByRecetaId(recetaId);

    const cultura = await this.getCulturaByCulturaId(culturaId);

    const culturaReceta: RecetaEntity = cultura.recetas.find(
      (e) => e.id === receta.id,
    );

    if (!culturaReceta)
      throw new BusinessLogicException(
        'La receta con el id dado no esta asociada a la cultura',
        BusinessError.PRECONDITION_FAILED,
      );

    cultura.recetas = cultura.recetas.filter((e) => e.id !== recetaId);
    await this.culturaRepository.save(cultura);
  }
}
