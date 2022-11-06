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
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaisDto } from '../pais/pais.dto';
import { PaisEntity } from '../pais/pais.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaPaisService } from './cultura-pais.service';
import { Role } from '../auth/models/role.enum';
import { Roles } from '../auth/Decorators/roles.decorator';

@Controller('culturas')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaPaisController {
  constructor(private readonly culturaPaisService: CulturaPaisService) {}

  @Roles(Role.Update_all)
  @Post(':culturaId/paises/:paisId')
  async addPaisCultura(
    @Param('culturaId') CulturaId: string,
    @Param('paisId') paisId: string,
  ) {
    return await this.culturaPaisService.addPaisCultura(CulturaId, paisId);
  }

  @Roles(Role.Read_all, Role.Read_Cultura)
  @Get(':culturaId/paises/:paisId')
  async findPaisByCulturaIdPaisId(
    @Param('culturaId') culturaId: string,
    @Param('paisId') paisId: string,
  ) {
    return await this.culturaPaisService.findPaisByCulturaIdPaisId(
      culturaId,
      paisId,
    );
  }

  @Roles(Role.Read_all, Role.Read_Cultura)
  @Get(':culturaId/paises')
  async findPaisesByCulturaId(@Param('culturaId') culturaId: string) {
    return await this.culturaPaisService.findPaisesByCulturaId(culturaId);
  }

  @Roles(Role.Update_all)
  @Put(':culturaId/paises')
  async associatePaisesCultura(
    @Body() paisDto: PaisDto[],
    @Param('culturaId') culturaId: string,
  ) {
    const paises = plainToInstance(PaisEntity, paisDto);
    return await this.culturaPaisService.associatePaisesCultura(
      culturaId,
      paises,
    );
  }

  @Roles(Role.Delete_all)
  @Delete(':culturaId/paises/:PaisId')
  @HttpCode(204)
  async deletePaisCultura(
    @Param('culturaId') culturaId: string,
    @Param('PaisId') PaisId: string,
  ) {
    return await this.culturaPaisService.deletePaisToCultura(culturaId, PaisId);
  }
}
