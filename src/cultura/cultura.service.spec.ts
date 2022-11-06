import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CulturaEntity } from './cultura.entity';
import { CulturaService } from './cultura.service';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';

describe('CulturaService', () => {
  let service: CulturaService;
  let repository: Repository<CulturaEntity>;
  let culturaList: Array<CulturaEntity>;

  const seedDatabase = async () => {
    repository.clear();
    culturaList = [];
    for (let i = 0; i < 5; i++) {
      const cultura: CulturaEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });
      culturaList.push(cultura);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CulturaService],
    }).compile();

    service = module.get<CulturaService>(CulturaService);
    repository = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all culturas', async () => {
    const culturas: CulturaEntity[] = await service.findAll();
    expect(culturas).not.toBeNull();
    expect(culturas).toHaveLength(culturaList.length);
  });

  it('findOne should return a cultura by id', async () => {
    const storedCultura: CulturaEntity = culturaList[0];
    const cultura: CulturaEntity = await service.findOne(storedCultura.id);
    expect(cultura).not.toBeNull();
    expect(cultura.nombre).toEqual(storedCultura.nombre);
    expect(cultura.descripcion).toEqual(storedCultura.descripcion);
  });

  it('findOne should throw an exception for an invalid cultura', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });

  it('create should return a new cultura', async () => {
    const cultura: CulturaEntity = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      recetas: [],
      productos: [],
      restaurantes: [],
      paises: [],
    };

    const newCultura: CulturaEntity = await service.create(cultura);
    expect(newCultura).not.toBeNull();

    const storedCultura: CulturaEntity = await repository.findOne({
      where: { id: `${newCultura.id}` },
    });
    expect(storedCultura).not.toBeNull();
    expect(storedCultura.id).not.toBeNull();
    expect(storedCultura.nombre).toEqual(newCultura.nombre);
    expect(storedCultura.descripcion).toEqual(newCultura.descripcion);
  });

  it('update should modify a cultura', async () => {
    const cultura: CulturaEntity = culturaList[0];
    cultura.nombre = 'New name';
    cultura.descripcion = 'New description';
    const updatedCultura: CulturaEntity = await service.update(
      cultura.id,
      cultura,
    );
    expect(updatedCultura).not.toBeNull();
    const storedCultura: CulturaEntity = await repository.findOne({
      where: { id: `${cultura.id}` },
    });
    expect(storedCultura).not.toBeNull();
    expect(storedCultura.nombre).toEqual(cultura.nombre);
    expect(storedCultura.descripcion).toEqual(cultura.descripcion);
  });

  it('update should throw an exception for an invalid cultura', async () => {
    let cultura: CulturaEntity = culturaList[0];
    cultura = {
      ...cultura,
      nombre: 'New name',
      descripcion: 'New address',
    };
    await expect(() => service.update('0', cultura)).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });

  it('delete should remove a cultura', async () => {
    const cultura: CulturaEntity = culturaList[0];
    await service.delete(cultura.id);
    const deletedCultura: CulturaEntity = await repository.findOne({
      where: { id: `${cultura.id}` },
    });
    expect(deletedCultura).toBeNull();
  });

  it('delete should throw an exception for an invalid cultura', async () => {
    const cultura: CulturaEntity = culturaList[0];
    await service.delete(cultura.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });
});
