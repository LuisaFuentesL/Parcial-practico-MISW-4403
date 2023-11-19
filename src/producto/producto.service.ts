import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,
    ) {}

    async findAll(): Promise<ProductoEntity[]> {
     return await this.productoRepository.find({ relations: ['tiendas'] });
    }

    async findOne(id: number): Promise<ProductoEntity> {
        const producto: ProductoEntity =
        await this.productoRepository.findOne({
            where: { id },
            relations: ['tiendas'],
        });
        if (!producto)
        throw new BusinessLogicException(
            'El producto con el id dado no fue encontrado',
            BusinessError.NOT_FOUND,
        );

        return producto;
    }

    async create(producto: ProductoEntity): Promise<ProductoEntity> {
        const tipos: string[] = ['Perecedero', 'No perecedero'];
        if (!tipos.includes(producto.tipo)) {
            throw new BusinessLogicException(
                'El tipo de producto no es válido',
                BusinessError.UNPROCESSABLE_ENTITY,
            );
        }
        return await this.productoRepository.save(producto);
    }

    async update(
        id: number,
        producto: ProductoEntity,
    ): Promise<ProductoEntity> {
        const persistedProducto: ProductoEntity =
        await this.productoRepository.findOne({ where: { id } });
        if (!persistedProducto)
        throw new BusinessLogicException(
            'El producto con el id dado no fue encontrado',
            BusinessError.NOT_FOUND,
        );

        const tipos: string[] = ['Perecedero', 'No perecedero'];
        if (!tipos.includes(producto.tipo)) {
            throw new BusinessLogicException(
                'El tipo de producto no es válido',
                BusinessError.UNPROCESSABLE_ENTITY,
            );
        }

        return await this.productoRepository.save({
        ...persistedProducto,
        ...producto,
        });
    }

    async delete(id: number) {
        const producto: ProductoEntity =
        await this.productoRepository.findOne({ where: { id } });
        if (!producto)
        throw new BusinessLogicException(
            'El producto con el id dado no fue encontrado',
            BusinessError.NOT_FOUND,
        );

        await this.productoRepository.remove(producto);
    }

}
