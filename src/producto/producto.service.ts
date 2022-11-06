import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductoEntity } from "./producto.entity";
import {
  BusinessError,
  BusinessLogicException,
} from "../shared/errors/business-errors";
import { Cache } from "cache-manager";
import { PaisEntity } from "../pais/pais.entity";

@Injectable()
export class ProductoService {
  cacheKey = "products";

  constructor(
    @InjectRepository(ProductoEntity)
    private readonly ProductoRepository: Repository<ProductoEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    return await this.ProductoRepository.save(producto);
  }

  async findAll(): Promise<ProductoEntity[]> {
    const cached: ProductoEntity[] = await this.cacheManager.get<
      ProductoEntity[]
    >(this.cacheKey);
    if (!cached) {
      const products: ProductoEntity[] = await this.ProductoRepository.find({
        relations: ["cultura"],
      });
      await this.cacheManager.set(this.cacheKey, products);
      return products;
    }
    return cached;
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.ProductoRepository.findOne({
      where: { id },
    });
    if (!producto)
      throw new BusinessLogicException(
        "Producto no encontrado",
        BusinessError.NOT_FOUND,
      );

    return producto;
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const persistedProducto: ProductoEntity =
      await this.ProductoRepository.findOne({
        where: { id },
      });
    if (!persistedProducto)
      throw new BusinessLogicException(
        "Producto no encontrado",
        BusinessError.NOT_FOUND,
      );

    return await this.ProductoRepository.save({
      ...persistedProducto,
      ...producto,
    });
  }

  async delete(id: string) {
    const producto: ProductoEntity = await this.ProductoRepository.findOne({
      where: { id },
    });
    if (!producto)
      throw new BusinessLogicException(
        "Producto no encontrado",
        BusinessError.NOT_FOUND,
      );
    else
      throw new BusinessLogicException(
        "Producto no encontrado",
        BusinessError.NOT_FOUND,
      );
    await this.ProductoRepository.remove(producto);
  }

  async emptyfunction() {

  }
}
