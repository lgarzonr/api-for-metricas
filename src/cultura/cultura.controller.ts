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
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { BusinessErrorsInterceptor } from "../shared/interceptors/business-errors.interceptor";
import { CulturaDto } from "./cultura.dto";
import { CulturaEntity } from "./cultura.entity";
import { CulturaService } from "./cultura.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/Decorators/roles.decorator";
import { Role } from "../auth/models/role.enum";

@Controller("culturas")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaController {
  private nameVar: string;

  constructor(private readonly culturaService: CulturaService) {}

  @Roles(Role.Read_all, Role.Read_Cultura)
  @Get()
  async findAll() {
    return await this.culturaService.findAll();
  }

  @Roles(Role.Read_all, Role.Read_Cultura)
  @Get(":culturaId")
  async findOne(@Param("culturaId") culturaId: string) {
    return await this.culturaService.findOne(culturaId);
  }

  @Roles(Role.Create_all)
  @Post()
  async create(@Body() culturaDto: CulturaDto) {
    const cultura: CulturaEntity = plainToInstance(CulturaEntity, culturaDto);
    return await this.culturaService.create(cultura);
  }

  @Roles(Role.Update_all)
  @Put(":culturaId")
  async update(
    @Param("culturaId") culturaId: string,
    @Body() culturaDto: CulturaDto,
  ) {
    const cultura: CulturaEntity = plainToInstance(CulturaEntity, culturaDto);
    return await this.culturaService.update(culturaId, cultura);
  }

  @Roles(Role.Delete_all)
  @Delete(":culturaId")
  @HttpCode(204)
  async delete(@Param("culturaId") culturaId: string) {
    return await this.culturaService.delete(culturaId);
  }
}
