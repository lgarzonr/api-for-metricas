import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { CulturaEntity } from '../cultura/cultura.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CacheModule } from '@nestjs/common';

describe('ProductoService', () => {
  let service: ProductoService;
  let productoRepository: Repository<ProductoEntity>;
  let culturaRepository: Repository<CulturaEntity>;
  let mockProductosList: Array<ProductoEntity>;
  let mockCultura: CulturaEntity;


  const seedProductos = async () => {
    productoRepository.clear();
    culturaRepository.clear();
    mockProductosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.commerce.product(),
        descripcion: faker.hacker.phrase(),
        tipoProducto: faker.commerce.productDescription(),
        historia: faker.lorem.paragraph(),
      });
      mockProductosList.push(producto);
    }
    mockCultura = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.hacker.phrase(),
    });
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    culturaRepository = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    await seedProductos();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Given a valid product, when repository save product then return new product', async () => {
    const mockProducto: ProductoEntity = {
      id: '',
      nombre: faker.commerce.product(),
      tipoProducto: faker.commerce.productDescription(),
      historia: faker.lorem.paragraph(),
      descripcion: faker.hacker.phrase(),
      cultura: mockCultura,
    };

    const persistedProduct: ProductoEntity = await service.create(mockProducto);
    expect(persistedProduct).not.toBeNull();

    const storedProduct: ProductoEntity = await productoRepository.findOne({
      where: { id: `${mockProducto.id}` },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.id).not.toBeNull();
    expect(storedProduct.nombre).toEqual(mockProducto.nombre);
    expect(storedProduct.descripcion).toEqual(mockProducto.descripcion);
    expect(storedProduct.tipoProducto).toEqual(mockProducto.tipoProducto);
    expect(storedProduct.historia).toEqual(mockProducto.historia);
  });

  it('Given a valid Product Id Then Return a persisted product', async () => {
    const storedProduct: ProductoEntity = mockProductosList[0];
    const product: ProductoEntity = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.nombre).toEqual(storedProduct.nombre);
    expect(product.descripcion).toEqual(storedProduct.descripcion);
    expect(product.tipoProducto).toEqual(storedProduct.tipoProducto);
    expect(product.historia).toEqual(storedProduct.historia);
  });

  it('When findall is call then return the complete list of products', async () => {
    const retrievedProducts: ProductoEntity[] = await service.findAll();
    expect(retrievedProducts).not.toBeNull();
    expect(retrievedProducts).toHaveLength(mockProductosList.length);
  });

  it('Given a valid Product Id when product name is updated then return new persisted product', async () => {
    const newName = faker.commerce.product();
    const storedProduct: ProductoEntity = mockProductosList[0];
    const product: ProductoEntity = await service.findOne(storedProduct.id);
    product.nombre = newName;
    await service.update(storedProduct.id, product);
    const updatedProduct: ProductoEntity = await service.findOne(
      storedProduct.id,
    );
    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct.nombre).toEqual(newName);
    expect(updatedProduct.nombre).not.toBe(storedProduct.nombre);
  });

  it('given product id then remove product from persisted list', async () => {
    const product: ProductoEntity = mockProductosList[0];
    await service.delete(product.id);
    const deleteProduct: ProductoEntity = await productoRepository.findOne({
      where: { id: `${product.id}` },
    });
    expect(deleteProduct).toBeNull();
  });

  it('Given a non existing product, then return error message', async () => {
    const product: ProductoEntity = mockProductosList[0];
    await service.delete(product.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'Producto no encontrado',
    );
  });
});
