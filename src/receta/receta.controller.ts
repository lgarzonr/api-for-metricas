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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';

@Controller('recetas')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class RecetaController {
  constructor(private readonly recetaService: RecetaService) {}

  @Roles(Role.Read_all, Role.Read_receta)
  @Get()
  async findAll() {
    return await this.recetaService.findAll();
  }

  @Roles(Role.Read_all, Role.Read_receta)
  @Get(':recetaId')
  async findOne(@Param('recetaId') recetaId: string) {
    return await this.recetaService.findOne(recetaId);
  }

  @Roles(Role.Create_all)
  @Post()
  async create(@Body() recetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.create(receta);
  }

  @Roles(Role.Update_all)
  @Put(':recetaId')
  async update(
    @Param('recetaId') recetaId: string,
    @Body() recetaDto: RecetaDto,
  ) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.update(recetaId, receta);
  }

  @Roles(Role.Delete_all)
  @Delete(':recetaId')
  @HttpCode(204)
  async delete(@Param('recetaId') recetaId: string) {
    return await this.recetaService.delete(recetaId);
  }
}
