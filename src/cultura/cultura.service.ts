import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturaEntity } from './cultura.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaService {
  cacheKey = 'culture';

  constructor(
    @InjectRepository(CulturaEntity)
    private readonly culturaRepository: Repository<CulturaEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(cultura: CulturaEntity): Promise<CulturaEntity> {
    return await this.culturaRepository.save(cultura);
  }

  async findAll(): Promise<CulturaEntity[]> {
    const cached: CulturaEntity[] = await this.cacheManager.get<
      CulturaEntity[]
    >(this.cacheKey);
    if (!cached) {
      const cultures: CulturaEntity[] = await this.culturaRepository.find({
        relations: ['recetas', 'productos', 'restaurantes', 'paises'],
      });
      await this.cacheManager.set(this.cacheKey, cultures);
      return cultures;
    }

    return cached;
  }

  async findOne(id: string): Promise<CulturaEntity> {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id },
      relations: ['recetas', 'productos', 'restaurantes', 'paises'],
    });
    if (!cultura)
      throw new BusinessLogicException(
        'La cultura con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    return cultura;
  }

  async update(id: string, cultura: CulturaEntity): Promise<CulturaEntity> {
    const persistedCultura: CulturaEntity =
      await this.culturaRepository.findOne({
        where: { id },
        relations: ['recetas', 'productos', 'restaurantes', 'paises'],
      });
    if (!persistedCultura)
    {
      new Error('La cultura con el id dado no fue encontrada');
      throw new BusinessLogicException(
        'La cultura con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    }

    return await this.culturaRepository.save({
      ...persistedCultura,
      ...cultura,
    });
  }

  async delete(id: string) {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id },
    });
    if (!cultura)
      throw new BusinessLogicException(
        'La cultura con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    await this.culturaRepository.remove(cultura);
  }

  async nonUsedMethods() {
    return "no used"
  }
}
