import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CulturaProductoService } from './cultura-producto.service';
import { CulturaEntity } from '../cultura/cultura.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class CulturaProductoResolver {
  constructor(
    private readonly culturaProductoService: CulturaProductoService,
  ) {}

  @Mutation(() => CulturaEntity)
  addProductoCultura(
    @Args('culturaId') culturaId: string,
    @Args('productoId') productoId: string,
  ) {
    return this.culturaProductoService.addProductoToCultura(
      culturaId,
      productoId,
    );
  }

  @Query(() => ProductoEntity)
  findProductoByCulturaAndProductoId(
    @Args('culturaId') culturaId: string,
    @Args('productoId') productoId: string,
  ) {
    return this.culturaProductoService.getProductByCulturaIdAndProductId(
      culturaId,
      productoId,
    );
  }

  @Query(() => [ProductoEntity])
  findProductosFromCultura(@Args('culturaId') culturaId: string) {
    return this.culturaProductoService.getProductosByCulturaId(culturaId);
  }

  @Mutation(() => CulturaEntity)
  associateProductosToCultura(
    @Args('culturaId') culturaId: string,
    @Args({ name: 'productosId', type: () => [String] })
    productosId: string[],
  ) {
    const productos = plainToInstance(
      ProductoEntity,
      productosId.map((id) => ({ id })),
    );
    return this.culturaProductoService.addProductosToCultura(
      culturaId,
      productos,
    );
  }

  @Mutation(() => String)
  deleteProductoFromCultura(
    @Args('culturaId') culturaId: string,
    @Args('productoId') productoId: string,
  ) {
    this.culturaProductoService.deleteProductoFromCultura(
      culturaId,
      productoId,
    );
    return culturaId;
  }
}
