import { CulturaPaisModule } from './cultura-pais/cultura-pais.module';
import { PaisModule } from './pais/pais.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CulturaEntity } from './cultura/cultura.entity';
import { CulturaModule } from './cultura/cultura.module';
import { RecetaEntity } from './receta/receta.entity';
import { RecetaModule } from './receta/receta.module';
import { CulturaRecetaModule } from './cultura-receta/cultura-receta.module';
import { ProductoModule } from './producto/producto.module';
import { ProductoEntity } from './producto/producto.entity';
import { PaisEntity } from './pais/pais.entity';
import { RestauranteModule } from './restaurante/restaurante.module';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { EstrellaMichellinModule } from './estrella-michellin/estrella-michellin.module';
import { EstrellaMichellinEntity } from './estrella-michellin/estrella-michellin.entity';
import { CulturaRestauranteModule } from './cultura-restaurante/cultura-restaurante.module';
import { CulturaProductoModule } from './cultura-producto/cultura-producto.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    CulturaPaisModule,
    PaisModule,
    CulturaModule,
    RecetaModule,
    ProductoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 55000,
      username: 'postgres',
      password: 'postgrespw',
      database: 'culturas_grastronomicas',
      entities: [
        CulturaEntity,
        RecetaEntity,
        RestauranteEntity,
        EstrellaMichellinEntity,
        PaisEntity,
        ProductoEntity,
      ],
      dropSchema: false,
      synchronize: false,
      keepConnectionAlive: true,
    }),
    CulturaRecetaModule,
    RestauranteModule,
    RestauranteModule,
    EstrellaMichellinModule,
    CulturaRestauranteModule,
    CulturaProductoModule,
    AuthModule,
    UserModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
