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
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/auth/Decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/role.enum';
import { RecetaEntity } from 'src/receta/receta.entity';
import { RecetaDto } from '../receta/receta.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaRecetaService } from './cultura-receta.service';

@Controller('culturas')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaRecetaController {
  constructor(private readonly culturaRecetaService: CulturaRecetaService) {}

  @Roles(Role.Update_all)
  @Post(':culturaId/recetas/:recetaId')
  async addRecetaCultura(
    @Param('culturaId') culturaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaRecetaService.addRecetaCultura(
      culturaId,
      recetaId,
    );
  }

  @Roles(Role.Read_all, Role.Read_Cultura)
  @Get(':culturaId/recetas/:recetaId')
  async findRecetaByCulturaIdRecetaId(
    @Param('culturaId') culturaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaRecetaService.findRecetaByCulturaIdRecetaId(
      culturaId,
      recetaId,
    );
  }

  @Roles(Role.Read_all, Role.Read_Cultura)
  @Get(':culturaId/recetas')
  async findRecetasByCulturaId(@Param('culturaId') culturaId: string) {
    return await this.culturaRecetaService.findRecetasByCulturaId(culturaId);
  }

  @Roles(Role.Update_all)
  @Put(':culturaId/recetas')
  async associateRecetasCultura(
    @Body() recetasDto: RecetaDto[],
    @Param('culturaId') culturaId: string,
  ) {
    const recetas = plainToInstance(RecetaEntity, recetasDto);
    return await this.culturaRecetaService.associateRecetasCultura(
      culturaId,
      recetas,
    );
  }

  @Roles(Role.Delete_all)
  @Delete(':culturaId/recetas/:recetaId')
  @HttpCode(204)
  async deleteRecetaCultura(
    @Param('culturaId') culturaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaRecetaService.deleteRecetaCultura(
      culturaId,
      recetaId,
    );
  }
}
