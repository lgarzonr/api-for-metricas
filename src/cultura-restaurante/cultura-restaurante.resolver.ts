import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CulturaRestauranteService } from '../cultura-restaurante/cultura-restaurante.service';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class CulturaRestauranteResolver {
  constructor(
    private readonly culturaRestauranteService: CulturaRestauranteService,
  ) {}

  @Mutation(() => CulturaEntity)
  addRestauranteCultura(
    @Args('culturaId') culturaId: string,
    @Args('restauranteId') restauranteId: string,
  ) {
    return this.culturaRestauranteService.addRestauranteCultura(
      culturaId,
      restauranteId,
    );
  }

  @Query(() => RestauranteEntity)
  findRestauranteByCulturaIdRestauranteId(
    @Args('culturaId') culturaId: string,
    @Args('restauranteId') restauranteId: string,
  ) {
    return this.culturaRestauranteService.findRestauranteByCulturaIdRestauranteId(
      culturaId,
      restauranteId,
    );
  }

  @Mutation(() => CulturaEntity)
  associateRestaurantesCultura(
    @Args('culturaId') culturaId: string,
    @Args({ name: 'restaurantesId', type: () => [String] })
    restaurantesId: string[],
  ) {
    const restaurantes = plainToInstance(
      RestauranteEntity,
      restaurantesId.map((id) => ({ id })),
    );
    return this.culturaRestauranteService.associateRestaurantesCultura(
      culturaId,
      restaurantes,
    );
  }

  @Mutation(() => String)
  deleteRestauranteCultura(
    @Args('culturaId') culturaId: string,
    @Args('restauranteId') restauranteId: string,
  ) {
    this.culturaRestauranteService.deleteRestauranteCultura(
      culturaId,
      restauranteId,
    );
    return culturaId;
  }
}
