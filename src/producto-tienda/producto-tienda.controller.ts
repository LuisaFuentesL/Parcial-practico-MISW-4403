import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ProductoTiendaService } from './producto-tienda.service';
import { TiendaEntity } from '../tienda/tienda.entity';
import { plainToInstance } from 'class-transformer';
import { TiendaDto } from '../tienda/tienda.dto';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {

    constructor(private readonly productoTiendaService: ProductoTiendaService) {}

    @Get(':productoId/tiendas/:tiendaId')
    async findTiendaFromProducto(@Param('tiendaId') tiendaId: number, @Param('productoId') productoId: number) {
    return await this.productoTiendaService.findTiendaFromProducto(productoId, tiendaId)
    }

    @Get(':productoId/tiendas')
    async findTiendasFromProducto(@Param('productoId') productoId: number) {
    return await this.productoTiendaService.findTiendasFromProducto(productoId);
    }

    @Post(':productoId/tiendas/:tiendaId/')
    async addTiendaToProducto(@Param('tiendaId') tiendaId: number, @Param('productoId') productoId: number) {
    return await this.productoTiendaService.addTiendaToProducto(productoId, tiendaId);
    }

    @Put(':productoId/tiendas')
    async updateTiendasFromProducto(@Param('productoId') productoId: number, @Body() tiendaDTO: TiendaDto[]) {
    const tiendas = plainToInstance(TiendaEntity, tiendaDTO)
    return await this.productoTiendaService.updateTiendasFromProducto(productoId, tiendas);
    }

    @Delete(':productoId/tiendas/:tiendaId')
    @HttpCode(204)
    async deleteTiendaFromProducto(@Param('productoId') productoId: number, @Param('tiendaId') tiendaId: number) {
        await this.productoTiendaService.deleteTiendaFromProducto(productoId, tiendaId);
    }
}
