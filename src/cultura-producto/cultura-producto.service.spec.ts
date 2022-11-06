import { Test, TestingModule } from '@nestjs/testing';
import { CulturaProductoService } from './cultura-producto.service';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { CulturaEntity } from '../cultura/cultura.entity';
import { faker } from '@faker-js/faker';
import mock = jest.mock;
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/common';

describe('CulturaProductoService', () => {
  let service: CulturaProductoService;
  let cultureRepository: Repository<CulturaEntity>;
  let culture: CulturaEntity;

  let productsRepository: Repository<ProductoEntity>;
  let mockProducts: ProductoEntity[];

  const seedMocks = async () => {
    productsRepository.clear();
    cultureRepository.clear();
    mockProducts = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productsRepository.save({
        nombre: faker.commerce.product(),
        descripcion: faker.hacker.phrase(),
        tipoProducto: faker.commerce.productDescription(),
        historia: faker.lorem.paragraph(),
      });
      mockProducts.push(producto);
    }
    culture = await cultureRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      productos: mockProducts,
    });
  };

  const mockNewProduct = () => {
    return productsRepository.save({
      nombre: faker.commerce.product(),
      descripcion: faker.hacker.phrase(),
      tipoProducto: faker.commerce.productDescription(),
      historia: faker.lorem.paragraph(),
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CulturaProductoService],
    }).compile();

    service = module.get<CulturaProductoService>(CulturaProductoService);
    productsRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    cultureRepository = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    await seedMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Given a new Product, when culture adds new Product then return new product List', async () => {
    const mocknewProduct: ProductoEntity = await mockNewProduct();

    const updatedCulture: CulturaEntity = await service.addProductoToCultura(
      culture.id,
      mocknewProduct.id,
    );
    const productListSize = mockProducts.length;
    expect(updatedCulture.productos.length).toBe(productListSize + 1);
    expect(updatedCulture.productos[productListSize].nombre).toBe(
      mocknewProduct.nombre,
    );
  });

  it('Given a non valid product , when culture adds new Product then throw exception', async () => {
    const nonValidProductId = '0';
    await expect(() =>
      service.addProductoToCultura(culture.id, nonValidProductId),
    ).rejects.toHaveProperty('message', 'Producto no encontrado');
  });

  it('Given a non valid culture , when culture adds new Product then throw exception', async () => {
    const nonValidCulture = '0';
    await expect(() =>
      service.addProductoToCultura(nonValidCulture, mockProducts[0].id),
    ).rejects.toHaveProperty('message', 'cultura no encontrada');
  });

  it('given a valid cultureId and productId when call get product from culture then return product', async () => {
    const product: ProductoEntity = mockProducts[0];
    const productFromCulture: ProductoEntity =
      await service.getProductByCulturaIdAndProductId(product.id, culture.id);

    expect(productFromCulture).not.toBeNull();
    expect(productFromCulture.nombre).toBe(product.nombre);
  });

  it('Given a non valid culture , when culture adds new Product then throw exception', async () => {
    const nonValidCulture = '0';
    await expect(() =>
      service.getProductByCulturaIdAndProductId(
        mockProducts[0].id,
        nonValidCulture,
      ),
    ).rejects.toHaveProperty('message', 'cultura no encontrada');
  });

  it('Given a non valid product , when culture adds new Product then throw exception', async () => {
    const nonValidproduct = '0';
    await expect(() =>
      service.getProductByCulturaIdAndProductId(nonValidproduct, culture.id),
    ).rejects.toHaveProperty('message', 'Producto no encontrado');
  });

  it('Given Culture Id, when call getCultureProduct then return all products from culture', async () => {
    const productsList = await service.getProductosByCulturaId(culture.id);
    expect(productsList.length).toBe(mockProducts.length);
  });
});
