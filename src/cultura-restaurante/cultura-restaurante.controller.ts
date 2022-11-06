import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaRestauranteService } from './cultura-restaurante.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RestauranteDto } from '../restaurante/restaurante.dto';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../auth/models/role.enum';
import { Roles } from '../auth/Decorators/roles.decorator';

@Controller('culturas')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaRestauranteController {
  constructor(
    private readonly culturaRestauranteService: CulturaRestauranteService,
  ) {}

  @Roles(Role.Update_all)
  @Post(':culturaId/restaurantes/:restauranteId')
  async addRestauranteCultura(
    @Param('culturaId') culturaId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.culturaRestauranteService.addRestauranteCultura(
      culturaId,
      restauranteId,
    );
  }

  @Roles(Role.Read_all, Role.Read_restaurante)
  @Get(':culturaId/restaurantes/:restauranteId')
  async findRestauranteByCulturaIdRestauranteId(
    @Param('culturaId') culturaId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.culturaRestauranteService.findRestauranteByCulturaIdRestauranteId(
      culturaId,
      restauranteId,
    );
  }

  @Roles(Role.Read_all, Role.Read_restaurante)
  @Get(':culturaId/restaurantes')
  async findRestaurantesByCulturaId(@Param('culturaId') culturaId: string) {
    return await this.culturaRestauranteService.findRestaurantesByCulturaId(
      culturaId,
    );
  }

  @Roles(Role.Update_all)
  @Put(':culturaId/restaurantes')
  async associateRestaurantesCultura(
    @Body() restauranteDto: RestauranteDto[],
    @Param('culturaId') culturaId: string,
  ) {
    const restaurantes = plainToInstance(RestauranteEntity, restauranteDto);
    return await this.culturaRestauranteService.associateRestaurantesCultura(
      culturaId,
      restaurantes,
    );
  }

  @Roles(Role.Delete_all)
  @Delete(':culturaId/restaurantes/:restauranteId')
  @HttpCode(204)
  async deleteRestauranteCultura(
    @Param('culturaId') culturaId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.culturaRestauranteService.deleteRestauranteCultura(
      culturaId,
      restauranteId,
    );
  }
}
