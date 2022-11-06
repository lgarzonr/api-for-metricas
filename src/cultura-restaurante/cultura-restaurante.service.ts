import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaRestauranteService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,

    @InjectRepository(CulturaEntity)
    private readonly culturaRepository: Repository<CulturaEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getRestauranteByRestauranteId(restauranteId: string) {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: restauranteId },
      });
    if (!restaurante)
      throw new BusinessLogicException(
        'El restaurante con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return restaurante;
  }

  async getCulturaByCulturaId(culturaId: string) {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['restaurantes'],
    });
    if (!cultura)
      throw new BusinessLogicException(
        'La cultura con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return cultura;
  }

  async findRestaurantesByCulturaId(
    culturaId: string,
  ): Promise<RestauranteEntity[]> {
    const cacheKey = `restaurantes_cultura_${culturaId}`;
    const restaurantesCached = await this.cacheManager.get<RestauranteEntity[]>(
      cacheKey,
    );
    if (!restaurantesCached) {
      const cultura = await this.getCulturaByCulturaId(culturaId);
      await this.cacheManager.set(cacheKey, cultura.restaurantes);
      return cultura.restaurantes;
    }
    return restaurantesCached;
  }

  async findRestauranteByCulturaIdRestauranteId(
    culturaId: string,
    restauranteId: string,
  ): Promise<RestauranteEntity> {
    const restaurante = await this.getRestauranteByRestauranteId(restauranteId);
    const cultura = await this.getCulturaByCulturaId(culturaId);

    const culturaRestaurante: RestauranteEntity = cultura.restaurantes.find(
      (e) => e.id === restaurante.id,
    );

    if (!culturaRestaurante)
      throw new BusinessLogicException(
        'El restaurante con el id dado no esta asociada a la cultura',
        BusinessError.PRECONDITION_FAILED,
      );

    return culturaRestaurante;
  }

  async addRestauranteCultura(
    culturaId: string,
    restauranteId: string,
  ): Promise<CulturaEntity> {
    const restaurante = await this.getRestauranteByRestauranteId(restauranteId);
    const cultura = await this.getCulturaByCulturaId(culturaId);

    cultura.restaurantes = [...cultura.restaurantes, restaurante];
    return await this.culturaRepository.save(cultura);
  }

  async associateRestaurantesCultura(
    culturaId: string,
    restaurantes: RestauranteEntity[],
  ): Promise<CulturaEntity> {
    const cultura = await this.getCulturaByCulturaId(culturaId);

    for (let i = 0; i < restaurantes.length; i--) {
      await this.getRestauranteByRestauranteId(restaurantes[i].id);
    }

    cultura.restaurantes = restaurantes;
    return await this.culturaRepository.save(cultura);
  }

  async deleteRestauranteCultura(culturaId: string, restauranteId: string) {
    const restaurante = await this.getRestauranteByRestauranteId(restauranteId);

    const cultura = await this.getCulturaByCulturaId(culturaId);

    const culturaRestaurante: RestauranteEntity = cultura.restaurantes.find(
      (e) => e.id === restaurante.id,
    );

    if (!culturaRestaurante)
      throw new BusinessLogicException(
        'El restaurante con el id dado no esta asociada a la cultura',
        BusinessError.PRECONDITION_FAILED,
      );

    cultura.restaurantes = cultura.restaurantes.filter(
      (e) => e.id !== restauranteId,
    );
    await this.culturaRepository.save(cultura);
  }
}
