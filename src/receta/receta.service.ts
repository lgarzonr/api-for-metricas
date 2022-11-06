import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class RecetaService {
  cacheKey = 'recetas';

  constructor(
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(receta: RecetaEntity): Promise<RecetaEntity> {
    return await this.recetaRepository.save(receta);
  }

  async findAll(): Promise<RecetaEntity[]> {
    const cached = await this.cacheManager.get<RecetaEntity[]>(this.cacheKey);
    if (!cached) {
      const recetas = await this.recetaRepository.find({
        relations: ['cultura'],
      }); 
      await this.cacheManager.set(this.cacheKey, recetas);
      return recetas;
    }

    return cached;
  }

  async findOne(id: string): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
      relations: ['cultura'],
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    return receta;
  }

  async update(id: string, receta: RecetaEntity): Promise<RecetaEntity> {
    const persistedReceta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
    });
    if (!persistedReceta)
      throw new BusinessLogicException(
        'La receta con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    return await this.recetaRepository.save({ ...persistedReceta, ...receta });
  }

  async delete(id: string) {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    await this.recetaRepository.remove(receta);
  }
}
