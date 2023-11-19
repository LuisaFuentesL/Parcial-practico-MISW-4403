import { Injectable } from '@nestjs/common';
import { TiendaEntity } from './tienda.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TiendaService {
    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>,
    ) {}

    async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find({
        relations: ['productos'],
    });
    }

    async findOne(id: number): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
        where: { id },
        relations: ['productos'],
    });
    if (!tienda)
        throw new BusinessLogicException(
        'La tienda con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
        );

    return tienda;
    }

    async create(tienda: TiendaEntity): Promise<TiendaEntity> {
        if (tienda.ciudad.length !== 3) {
            throw new BusinessLogicException(
                'El código de la ciudad no es válido. Debe tener tres caracteres.',
                BusinessError.UNPROCESSABLE_ENTITY,
            );
        }
    
        return await this.tiendaRepository.save(tienda);
    }

    async update(id: number, tienda: TiendaEntity): Promise<TiendaEntity> {
    const persistedTienda: TiendaEntity = await this.tiendaRepository.findOne({
        where: { id },
    });
    if (!persistedTienda)
        throw new BusinessLogicException(
        'La tienda con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
        );
    
    if (tienda.ciudad.length !== 3) {
        throw new BusinessLogicException(
            'El código de la ciudad no es válido. Debe tener tres caracteres.',
            BusinessError.UNPROCESSABLE_ENTITY,
        );
    }

    return await this.tiendaRepository.save({ ...persistedTienda, ...tienda });
    }

    async delete(id: number) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
        where: { id },
    });
    if (!tienda)
        throw new BusinessLogicException(
        'La tienda con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
        );

    await this.tiendaRepository.remove(tienda);
    }
}
