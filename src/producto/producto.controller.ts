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
import { ProductoService } from './producto.service';
import { ProductoDto } from './producto.dto';
import { plainToInstance } from 'class-transformer';
import { ProductoEntity } from './producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/Decorators/roles.decorator';
import { Role } from '../auth/models/role.enum';
import { PaisEntity } from "../pais/pais.entity";

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Roles(Role.Read_all, Role.Read_Producto)
  @Get()
  async findAll() {
    return await this.productoService.findAll();
  }

  @Roles(Role.Read_all, Role.Read_Producto)
  @Get(':productoId')
  async findOne(@Param('productoId') productoId: string) {
    return await this.productoService.findOne(productoId);
  }

  @Roles(Role.Create_all)
  @Post()
  async create(@Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.create(producto);
  }

  @Roles(Role.Update_all)
  @Put(':productoId')
  async update(
    @Param('productoId') productoId: string,
    @Body() productoDto: ProductoDto,
  ) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.update(productoId, producto);
  }

  @Roles(Role.Delete_all)
  @Delete(':productoId')
  @HttpCode(204)
  async delete(@Param('productoId') productoId: string) {
    return await this.productoService.delete(productoId);
  }
}
