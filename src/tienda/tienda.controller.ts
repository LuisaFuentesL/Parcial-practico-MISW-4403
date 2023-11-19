import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { TiendaEntity } from './tienda.entity';
import { plainToInstance } from 'class-transformer';
import { TiendaDto } from './tienda.dto';

@Controller('tiendas')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaController {
    constructor(private readonly tiendaService: TiendaService) { }

    @Get()
    async findAll() {
    return await this.tiendaService.findAll();
    }

    @Get(':tiendaId')
    async findOne(@Param('tiendaId') tiendaId: number) {
    return await this.tiendaService.findOne(tiendaId);
    }

    @Post()
    async create(@Body() tiendaDTO: TiendaDto) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDTO);
    return await this.tiendaService.create(tienda);
    }

    @Put(':tiendaId')
    async update(@Param('tiendaId') tiendaId: number, @Body() tiendaDTO: TiendaDto) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDTO);
    return await this.tiendaService.update(tiendaId, tienda);
    }

    @Delete(':tiendaId')
    @HttpCode(204)
    async delete(@Param('tiendaId') tiendaId: number) {
    return await this.tiendaService.delete(tiendaId);
    }
}
