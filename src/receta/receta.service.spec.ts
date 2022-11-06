import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { faker } from '@faker-js/faker';
import { CulturaEntity } from '../cultura/cultura.entity';
import { CacheModule } from '@nestjs/common';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let repositoryCultura: Repository<CulturaEntity>;
  let recetaList: Array<RecetaEntity>;
  let cultura: CulturaEntity;

  const seedDatabase = async () => {
    repository.clear();
    repositoryCultura.clear();
    recetaList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fotoPlato: faker.image.imageUrl(),
        videoPreparacion: faker.image.imageUrl(),
        preparacion: faker.lorem.paragraph(),
      });
      recetaList.push(receta);
    }
    cultura = await repositoryCultura.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    repositoryCultura = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetaList.length);
  });

  it('findOne should return a receta by id', async () => {
    const storedReceta: RecetaEntity = recetaList[0];
    const receta: RecetaEntity = await service.findOne(storedReceta.id);
    expect(receta).not.toBeNull();
    expect(receta.nombre).toEqual(storedReceta.nombre);
    expect(receta.descripcion).toEqual(storedReceta.descripcion);
    expect(receta.fotoPlato).toEqual(storedReceta.fotoPlato);
    expect(receta.videoPreparacion).toEqual(storedReceta.videoPreparacion);
    expect(receta.preparacion).toEqual(storedReceta.preparacion);
  });

  it('findOne should throw an exception for an invalid receta', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La receta con el id dado no fue encontrada',
    );
  });

  it('create should return a new receta', async () => {
    const receta: RecetaEntity = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fotoPlato: faker.image.imageUrl(),
      videoPreparacion: faker.image.imageUrl(),
      preparacion: faker.lorem.paragraph(),
      cultura,
    };

    const newReceta: RecetaEntity = await service.create(receta);
    expect(newReceta).not.toBeNull();

    const storedReceta: RecetaEntity = await repository.findOne({
      where: { id: `${newReceta.id}` },
    });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.id).not.toBeNull();
    expect(storedReceta.nombre).toEqual(newReceta.nombre);
    expect(storedReceta.descripcion).toEqual(newReceta.descripcion);
    expect(storedReceta.fotoPlato).toEqual(newReceta.fotoPlato);
    expect(storedReceta.videoPreparacion).toEqual(newReceta.videoPreparacion);
    expect(storedReceta.preparacion).toEqual(newReceta.preparacion);
  });

  it('update should modify a receta', async () => {
    const receta: RecetaEntity = recetaList[0];
    receta.nombre = 'New name';
    receta.descripcion = 'New description';
    const updatedReceta: RecetaEntity = await service.update(receta.id, receta);
    expect(updatedReceta).not.toBeNull();
    const storedReceta: RecetaEntity = await repository.findOne({
      where: { id: `${receta.id}` },
    });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(receta.nombre);
    expect(storedReceta.descripcion).toEqual(receta.descripcion);
  });

  it('update should throw an exception for an invalid receta', async () => {
    let receta: RecetaEntity = recetaList[0];
    receta = {
      ...receta,
      nombre: 'New name',
      descripcion: 'New address',
    };
    await expect(() => service.update('0', receta)).rejects.toHaveProperty(
      'message',
      'La receta con el id dado no fue encontrada',
    );
  });

  it('delete should remove a receta', async () => {
    const receta: RecetaEntity = recetaList[0];
    await service.delete(receta.id);
    const deletedReceta: RecetaEntity = await repository.findOne({
      where: { id: `${receta.id}` },
    });
    expect(deletedReceta).toBeNull();
  });

  it('delete should throw an exception for an invalid receta', async () => {
    const receta: RecetaEntity = recetaList[0];
    await service.delete(receta.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La receta con el id dado no fue encontrada',
    );
  });
});
