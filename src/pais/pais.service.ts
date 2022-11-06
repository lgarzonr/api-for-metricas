import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PaisEntity } from './pais.entity';

@Injectable()
export class PaisService {
  cacheKey = 'paises';

  constructor(
    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(pais: PaisEntity): Promise<PaisEntity> {
    return await this.paisRepository.save(pais);
  }

  async findAll(): Promise<PaisEntity[]> {
    const cached: PaisEntity[] = await this.cacheManager.get<PaisEntity[]>(
      this.cacheKey,
    );

    if (!cached) {
      const paises: PaisEntity[] = await this.paisRepository.find({
        relations: ['culturas'],
      });
      await this.cacheManager.set(this.cacheKey, paises, { ttl: 10 });
      return paises;
    }
    return cached;
  }

  async findOne(id: string): Promise<PaisEntity> {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id },
    });
    if (!pais)
      throw new BusinessLogicException(
        'El país con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return pais;
  }

  async update(id: string, pais: PaisEntity): Promise<PaisEntity> {
    const persistedPais: PaisEntity = await this.paisRepository.findOne({
      where: { id },
    });
    if (!persistedPais)
      throw new BusinessLogicException(
        'El país con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return await this.paisRepository.save({ ...persistedPais, ...pais });
  }

  async delete(id: string) {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id },
    });
    if (!pais)
      throw new BusinessLogicException(
        'El país con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    await this.paisRepository.remove(pais);
  }
}
