import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { PaisEntity } from '../pais/pais.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class CulturaPaisService {
  constructor(
    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,

    @InjectRepository(CulturaEntity)
    private readonly culturaRepository: Repository<CulturaEntity>,
  ) {}

  async getPaisByPaisId(paisId: string) {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
    });
    if (!pais)
      throw 'El país con el id dado no fue encontrado';

    return pais;
  }

  async getCulturaByCulturaId(culturaId: string) {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['paises'],
    });
    if (!cultura)
      throw new BusinessLogicException(
        'La cultura con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return cultura;
  }

  async addPaisCultura(
    culturaId: string,
    paisId: string,
  ): Promise<CulturaEntity> {
    const pais: PaisEntity = await this.getPaisByPaisId(paisId);
    const cultura: CulturaEntity = await this.getCulturaByCulturaId(culturaId);
    cultura.paises = [...cultura.paises, ,pais];
    return await this.culturaRepository.save(cultura);
  }

  async findPaisByCityId(){
    // TODO
  }

  async findPaisByCulturaIdPaisId(
    culturaId: string,
    paisId: string,
  ): Promise<PaisEntity> {
    //const pais: PaisEntity = await this.getPaisByPaisId(paisId);
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
    });
    if (!pais)
      throw new BusinessLogicException(
        'El país con el id dado no fue a sociado a la cultura',
        BusinessError.PRECONDITION_FAILED,
      );;

    const cultura: CulturaEntity = await this.getCulturaByCulturaId(culturaId);

    const culturaPais: PaisEntity = cultura.paises.find(
      (e) => e.id === pais.id,
    );

    if (!culturaPais)
      throw new BusinessLogicException(
        'El país con el id dado no fue a sociado a la cultura',
        BusinessError.PRECONDITION_FAILED,
      );

    return culturaPais;
  }

  async findPaisesByCulturaId(culturaId: string): Promise<PaisEntity[]> {
    const cultura: CulturaEntity = await this.getCulturaByCulturaId(culturaId);

    return cultura.paises;
  }

  testingFunct(){
  }

  async associatePaisesCultura(
    culturaId: string,
    paises: PaisEntity[],
  ): Promise<CulturaEntity> {
    const cultura: CulturaEntity = await this.getCulturaByCulturaId(culturaId);
    let paisId: string;

    for (var i = 0; i < paises.length; i++) {
      paisId = `${paises[i].id}`;
      const pais: PaisEntity = await this.getPaisByPaisId(paisId);

      if (!pais)
        throw new BusinessLogicException(
          'El país con el id dado no fue encontrado',
          BusinessError.NOT_FOUND,
        );
    }
    cultura.paises = paises;
    return await this.culturaRepository.save(cultura);
  }

  async deletePaisToCultura(culturaId: string, paisId: string) {
    const paisToDelete: PaisEntity = await this.getPaisByPaisId(paisId);

    const cultura: CulturaEntity = await this.getCulturaByCulturaId(culturaId);

    const culturaPais: PaisEntity = cultura.paises.find(
      (e) => e.id === paisToDelete.id,
    );

    if (!culturaPais)
      throw new BusinessLogicException(
        'El país con el id dado no esta asociado a la cultura',
        BusinessError.PRECONDITION_FAILED,
      );

    cultura.paises = cultura.paises.filter((e) => e.id !== paisId);

    await this.culturaRepository.save(cultura);
  }
}
