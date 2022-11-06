import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EstrellaMichellinEntity } from '../estrella-michellin/estrella-michellin.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { CacheModule } from '@nestjs/common';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restauranteList: Array<RestauranteEntity>;

  let estrellaRespository: Repository<EstrellaMichellinEntity>;
  let estrellasList: EstrellaMichellinEntity[];

  const seedDatabase = async () => {
    repository.clear();
    estrellaRespository.clear();

    restauranteList = [];
    estrellasList = [];

    for (let i = 0; i < 5; i++) {
      const estrella: EstrellaMichellinEntity = await estrellaRespository.save({
        numeroEstrella: 2,
        fechaObtencion: new Date(),
      });
      estrellasList.push(estrella);

      const restaurante: RestauranteEntity = await repository.save({
        nombre: faker.company.name(),
      });
      restauranteList.push(restaurante);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    estrellaRespository = module.get<Repository<EstrellaMichellinEntity>>(
      getRepositoryToken(EstrellaMichellinEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurante', async () => {
    const restaurante: RestauranteEntity[] = await service.findAll();
    expect(restaurante).not.toBeNull();
    expect(restaurante).toHaveLength(restauranteList.length);
  });

  it('findOne should return a restaurante by id', async () => {
    const restaurante: RestauranteEntity = await service.findOne(
      restauranteList[0].id,
    );
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(restauranteList[0].nombre);
  });

  it('findOne should throw an exception for an invalid restaurante', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no existe',
    );
  });

  it('create should return a new restaurante', async () => {
    const restaurante: RestauranteEntity = {
      id: '',
      nombre: faker.company.name(),
      culturas: [],
      estrellas: estrellasList,
    };
    const newRestaurante: RestauranteEntity = await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();
    const storedRestaurante: RestauranteEntity = await repository.findOne({
      where: { id: `${newRestaurante.id}` },
    });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.id).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(newRestaurante.nombre);
  });

  it('update should modify a restaurante', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    restaurante.nombre = 'New name';
    const updatedRestaurante: RestauranteEntity = await service.update(
      restaurante.id,
      restaurante,
    );
    expect(updatedRestaurante).not.toBeNull();
    const storedRestaurante: RestauranteEntity = await repository.findOne({
      where: { id: `${restaurante.id}` },
    });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(restaurante.nombre);
  });

  it('update should throw an exception for an invalid restaurante', async () => {
    let restaurante: RestauranteEntity = restauranteList[0];
    restaurante = {
      ...restaurante,
      nombre: 'New name',
    };
    await expect(() => service.update('0', restaurante)).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no existe',
    );
  });

  it('delete should remove a restaurante', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await service.delete(restaurante.id);
    const deletedRestaurante: RestauranteEntity = await repository.findOne({
      where: { id: `${restaurante.id}` },
    });
    expect(deletedRestaurante).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurante', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await service.delete(restaurante.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no existe',
    );
  });
});
