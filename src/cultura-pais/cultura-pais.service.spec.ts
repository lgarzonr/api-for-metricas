import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { PaisEntity } from '../pais/pais.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CulturaPaisService } from './cultura-pais.service';

describe('CulturaPaisService', () => {
  let service: CulturaPaisService;
  let culturaRepository: Repository<CulturaEntity>;
  let paisRepository: Repository<PaisEntity>;
  let cultura: CulturaEntity;
  let ListaPaises: PaisEntity[];

  const seedDatabase = async () => {
    paisRepository.clear();
    culturaRepository.clear();

    ListaPaises = [];
    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await paisRepository.save({
        nombre: faker.address.country(),
        codigo: faker.address.countryCode(),
        descripcion: faker.lorem.paragraph(),
        cultura: await getNewCultura(),
      });
      ListaPaises.push(pais);
    }

    cultura = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      paises: ListaPaises,
    });
  };

  const getNewPais = () => {
    return paisRepository.save({
      nombre: faker.address.country(),
      codigo: faker.address.countryCode(),
      descripcion: faker.lorem.paragraph(),
    });
  };

  const getNewCultura = () => {
    return culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaPaisService],
    }).compile();

    service = module.get<CulturaPaisService>(CulturaPaisService);
    paisRepository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    culturaRepository = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPaisCultura should add a pais to a cultura', async () => {
    const newPais: PaisEntity = await getNewPais();
    const newCultura: CulturaEntity = await getNewCultura();

    const result: CulturaEntity = await service.addPaisCultura(
      newCultura.id,
      newPais.id,
    );

    expect(result.paises.length).toBe(1);
    expect(result.paises[0]).not.toBeNull();
    expect(result.paises[0].nombre).toBe(newPais.nombre);
    expect(result.paises[0].codigo).toBe(newPais.codigo);
    expect(result.paises[0].descripcion).toBe(newPais.descripcion);
  });

  it('addPaisCultura should thrown exception for an invalid pais', async () => {
    const newCultura: CulturaEntity = await getNewCultura();

    await expect(() =>
      service.addPaisCultura(newCultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El país con el id dado no fue encontrado',
    );
  });

  it('addPaisCultura should thrown exception for an invalid cultura', async () => {
    const newPais: PaisEntity = await getNewPais();

    await expect(() =>
      service.addPaisCultura('0', newPais.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });

  it('findPaisByCulturaIdPaisId Id should return pais by cultura', async () => {
    const pais: PaisEntity = ListaPaises[0];
    const storedPais: PaisEntity = await service.findPaisByCulturaIdPaisId(
      cultura.id,
      pais.id,
    );
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toBe(pais.nombre);
    expect(storedPais.codigo).toBe(pais.codigo);
    expect(storedPais.descripcion).toBe(pais.descripcion);
  });

  it('findPaisByCulturaIdPaisId should throw an exception for an invalid pais', async () => {
    await expect(() =>
      service.findPaisByCulturaIdPaisId(cultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El país con el id dado no fue a sociado a la cultura',
    );
  });

  it('findPaisByCulturaIdPaisId should throw an exception for an invalid cultura', async () => {
    const pais: PaisEntity = ListaPaises[0];
    await expect(() =>
      service.findPaisByCulturaIdPaisId('0', pais.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });

  it('findPaisByCulturaIdPaisId should throw an exception for a pais not associated to the cultura', async () => {
    const newPais: PaisEntity = await getNewPais();

    await expect(() =>
      service.findPaisByCulturaIdPaisId(cultura.id, newPais.id),
    ).rejects.toHaveProperty(
      'message',
      'El país con el id dado no fue a sociado a la cultura',
    );
  });

  it('findPaisesByCulturaId should return paises by cultura', async () => {
    const paises: PaisEntity[] = await service.findPaisesByCulturaId(
      cultura.id,
    );
    expect(paises.length).toBe(5);
  });

  it('findPaisesByCulturaId should throw an exception for an invalid cultura', async () => {
    await expect(() =>
      service.findPaisesByCulturaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });

  it('associatePaisesCultura should update paises list for a culture', async () => {
    const newPais: PaisEntity = await getNewPais();

    const updateCultura: CulturaEntity = await service.associatePaisesCultura(
      cultura.id,
      [newPais],
    );
    expect(updateCultura.paises.length).toBe(1);

    expect(updateCultura.paises[0].nombre).toBe(newPais.nombre);
    expect(updateCultura.paises[0].codigo).toBe(newPais.codigo);
    expect(updateCultura.paises[0].descripcion).toBe(newPais.descripcion);
  });

  it('associatePaisesCultura should throw an exception for an invalid cultura', async () => {
    const newPais: PaisEntity = await getNewPais();

    await expect(() =>
      service.associatePaisesCultura('0', [newPais]),
    ).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });

  it('associatePaisesCultura should throw an exception for an invalid pais', async () => {
    const newPais: PaisEntity = ListaPaises[0];
    newPais.id = '0';

    await expect(() =>
      service.associatePaisesCultura(cultura.id, [newPais]),
    ).rejects.toHaveProperty(
      'message',
      'El país con el id dado no fue encontrado',
    );
  });

  it('deletePaisToCultura should remove a pais from a cultura', async () => {
    const pais: PaisEntity = ListaPaises[0];

    await service.deletePaisToCultura(cultura.id, pais.id);

    const storedCultura: CulturaEntity = await culturaRepository.findOne({
      where: { id: `${cultura.id}` },
      relations: ['paises'],
    });
    const deletedPais: PaisEntity = storedCultura.paises.find(
      (a) => a.id === pais.id,
    );

    expect(deletedPais).toBeUndefined();
  });

  it('deletePaisToCultura should thrown an exception for an invalid pais', async () => {
    await expect(() =>
      service.deletePaisToCultura(cultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El país con el id dado no fue encontrado',
    );
  });

  it('deletePaisToCultura should thrown an exception for an invalid cultura', async () => {
    const pais: PaisEntity = ListaPaises[0];
    await expect(() =>
      service.deletePaisToCultura('0', pais.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });

  it('deletePaisToCultura should thrown an exception for an non asocciated pais', async () => {
    const newPais: PaisEntity = await getNewPais();

    await expect(() =>
      service.deletePaisToCultura(cultura.id, newPais.id),
    ).rejects.toHaveProperty(
      'message',
      'El país con el id dado no esta asociado a la cultura',
    );
  });
});
