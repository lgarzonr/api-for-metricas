import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { plainToInstance } from 'class-transformer';
import { ProductoDto } from './producto.dto';

@Resolver()
export class ProductoResolver {
  constructor(private productoService: ProductoService) {}

  @Query(() => [ProductoEntity])
  productos(): Promise<ProductoEntity[]> {
    return this.productoService.findAll();
  }

  @Query(() => ProductoEntity)
  producto(@Args('id') id: string): Promise<ProductoEntity> {
    return this.productoService.findOne(id);
  }

  @Mutation(() => ProductoEntity)
  addProducto(
    @Args('producto') productoDto: ProductoDto,
  ): Promise<ProductoEntity> {
    const receta = plainToInstance(ProductoEntity, productoDto);
    return this.productoService.create(receta);
  }

  @Mutation(() => ProductoEntity)
  updateProducto(
    @Args('id') id: string,
    @Args('producto') productoDto: ProductoDto,
  ): Promise<ProductoEntity> {
    const producto = plainToInstance(ProductoEntity, productoDto);
    return this.productoService.update(id, producto);
  }

  @Mutation(() => String)
  deleteProducto(@Args('id') id: string) {
    this.productoService.delete(id);
    return id;
  }
}
