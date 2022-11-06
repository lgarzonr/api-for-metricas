import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturaEntity } from 'src/cultura/cultura.entity';
import { RecetaEntity } from 'src/receta/receta.entity';
import { CulturaRecetaService } from './cultura-receta.service';

@Resolver()
export class CulturaRecetaResolver {
  constructor(private readonly culturaRecetaService: CulturaRecetaService) {}

  @Mutation(() => CulturaEntity)
  addRecetaCultura(
    @Args('culturaId') culturaId: string,
    @Args('recetaId') recetaId: string,
  ) {
    return this.culturaRecetaService.addRecetaCultura(culturaId, recetaId);
  }

  @Query(() => [RecetaEntity])
  findRecetasFromCultura(@Args('culturaId') culturaId: string) {
    return this.culturaRecetaService.findRecetasByCulturaId(culturaId);
  }

  @Query(() => RecetaEntity)
  findRecetaByCulturaIdRecetaId(
    @Args('culturaId') culturaId: string,
    @Args('recetaId') recetaId: string,
  ) {
    return this.culturaRecetaService.findRecetaByCulturaIdRecetaId(
      culturaId,
      recetaId,
    );
  }

  @Mutation(() => CulturaEntity)
  associateRecetasCultura(
    @Args('culturaId') culturaId: string,
    @Args({ name: 'recetasId', type: () => [String] })
    recetasId: string[],
  ) {
    const recetas = plainToInstance(
      RecetaEntity,
      recetasId.map((id) => ({ id })),
    );
    return this.culturaRecetaService.associateRecetasCultura(
      culturaId,
      recetas,
    );
  }

  @Mutation(() => String)
  deleteRecetaCultura(
    @Args('culturaId') culturaId: string,
    @Args('recetaId') recetaId: string,
  ) {
    this.culturaRecetaService.deleteRecetaCultura(culturaId, recetaId);
    return culturaId;
  }
}
