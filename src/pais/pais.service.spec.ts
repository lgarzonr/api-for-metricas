import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paises = Array<PaisEntity>();

  const seedDatabase = async () => {
    repository.clear();
    paises = [];

    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await repository.save({
        nombre: faker.address.country(),
        codigo: faker.address.countryCode(),
        descripcion: faker.lorem.paragraph(),
      });
      paises.push(pais);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all paises', async () => {
    const paises: PaisEntity[] = await service.findAll();
    expect(paises).not.toBeNull();
    expect(paises).toHaveLength(paises.length);
  });

  it('findOne should return a pais by id', async () => {
    const storedCountry: PaisEntity = paises[0];
    const pais: PaisEntity = await service.findOne(storedCountry.id);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(storedCountry.nombre);
    expect(pais.codigo).toEqual(storedCountry.codigo);
    expect(pais.descripcion).toEqual(storedCountry.descripcion);
  });

  it('findOne should throw an exception for an invalid pais', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El país con el id dado no fue encontrado',
    );
  });

  it('create should return a new pais', async () => {
    const pais1: PaisEntity = {
      id: '',
      nombre: faker.address.country(),
      codigo: faker.address.countryCode(),
      descripcion: faker.lorem.paragraph(),
      culturas: [],
    };

    const newpais: PaisEntity = await service.create(pais1);
    expect(newpais).not.toBeNull();

    const storedpais: PaisEntity = await repository.findOne({
      where: { id: `${newpais.id}` },
    });
    expect(storedpais).not.toBeNull();
    expect(storedpais.nombre).toEqual(newpais.nombre);
    expect(storedpais.codigo).toEqual(newpais.codigo);
    expect(storedpais.descripcion).toEqual(newpais.descripcion);
  });

  it('update should modify a pais', async () => {
    const pais: PaisEntity = paises[0];
    pais.nombre = 'New name';
    pais.codigo = 'New code';
    const updatedpais: PaisEntity = await service.update(pais.id, pais);
    expect(updatedpais).not.toBeNull();
    const storedpais: PaisEntity = await repository.findOne({
      where: { id: `${pais.id}` },
    });
    expect(storedpais).not.toBeNull();
    expect(storedpais.nombre).toEqual(pais.nombre);
    expect(storedpais.codigo).toEqual(pais.codigo);
  });

  it('update should throw an exception for an invalid pais', async () => {
    let pais: PaisEntity = paises[0];
    pais = {
      ...pais,
      nombre: 'New name',
      codigo: 'New code',
    };
    await expect(() => service.update('0', pais)).rejects.toHaveProperty(
      'message',
      'El país con el id dado no fue encontrado',
    );
  });

  it('delete should remove a pais', async () => {
    const pais: PaisEntity = paises[0];
    await service.delete(pais.id);
    const deletedPais: PaisEntity = await repository.findOne({
      where: { id: `${pais.id}` },
    });
    expect(deletedPais).toBeNull();
  });

  it('delete should throw an exception for an invalid pais', async () => {
    const pais: PaisEntity = paises[0];
    await service.delete(pais.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El país con el id dado no fue encontrado',
    );
  });
});
