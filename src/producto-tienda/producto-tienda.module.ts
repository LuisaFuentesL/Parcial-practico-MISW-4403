import { Module } from '@nestjs/common';
import { ProductoTiendaService } from './producto-tienda.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoEntity } from '../producto/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity, TiendaEntity])],
  //controllers: [ProductoTiendaController],
  providers: [ProductoTiendaService],
})
export class ProductoTiendaModule {}
