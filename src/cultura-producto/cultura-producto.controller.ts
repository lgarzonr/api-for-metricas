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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaProductoService } from './cultura-producto.service';
import { plainToInstance } from 'class-transformer';
import { ProductoEntity } from '../producto/producto.entity';
import { ProductoDto } from '../producto/producto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/Decorators/roles.decorator';
import { Role } from '../auth/models/role.enum';

@Controller('culturas')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaProductoController {
  constructor(
    private readonly culturaProductoService: CulturaProductoService,
  ) {}

  @Roles(Role.Update_all)
  @Post(':culturaId/productos/:productoId')
  async addProductoCultura(
    @Param('culturaId') culturaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturaProductoService.addProductoToCultura(
      culturaId,
      productoId,
    );
  }

  @Roles(Role.Read_all, Role.Read_Cultura)
  @Get(':culturaId/productos/:productoId')
  async getProductoByCulturaIdProductoId(
    @Param('culturaId') culturaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturaProductoService.getProductByCulturaIdAndProductId(
      productoId,
      culturaId,
    );
  }

  @Roles(Role.Read_all, Role.Read_Cultura)
  @Get(':culturaId/productos')
  async getAllProductosByCulturaId(@Param('culturaId') culturaId: string) {
    return await this.culturaProductoService.getProductosByCulturaId(culturaId);
  }

  @Roles(Role.Update_all)
  @Put(':culturaId/productos')
  async addListProductoToCultura(
    @Body() productosDto: ProductoDto[],
    @Param('culturaId') culturaId: string,
  ) {
    const productos = plainToInstance(ProductoEntity, productosDto);
    return await this.culturaProductoService.addProductosToCultura(
      culturaId,
      productos,
    );
  }

  @Roles(Role.Delete_all)
  @Delete(':culturaId/productos/:productoId')
  @HttpCode(204)
  async deleteProductoFromCultura(
    @Param('culturaId') culturaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturaProductoService.deleteProductoFromCultura(
      culturaId,
      productoId,
    );
  }
}
