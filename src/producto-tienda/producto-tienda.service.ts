import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductoTiendaService {

    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,
    
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
      ) {}
    
      async addTiendaToProducto(productoId: number, tiendaId: number): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: productoId }, relations: ['tiendas'] });
        if (!producto)
            throw new BusinessLogicException("El producto con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { id: tiendaId } });
        if (!tienda)
            throw new BusinessLogicException("La tienda con el id dado no fue encontrada", BusinessError.NOT_FOUND);
    
        producto.tiendas = [...producto.tiendas, tienda];
        return await this.productoRepository.save(producto);
    }
    
      async findTiendaFromProducto(productoId: number, tiendaId: number): Promise<TiendaEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: productoId }, relations: ['tiendas'] });
        if (!producto)
            throw new BusinessLogicException("El producto con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        const persistedTienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { id: tiendaId } });
        if (!persistedTienda)
            throw new BusinessLogicException("La tienda con el id dado no fue encontrada", BusinessError.NOT_FOUND);
        const tienda: TiendaEntity = producto.tiendas.find(tiendaEntity => tiendaEntity.id === tiendaId);
        if (!tienda)
            throw new BusinessLogicException("La tienda con el id dado no esta asociada al producto", BusinessError.PRECONDITION_FAILED);
    
        return tienda;
    }
    
      async findTiendasFromProducto(productoId: number): Promise<TiendaEntity[]> {
        const producto: ProductoEntity = await this.productoRepository.findOne({
            where: { id: productoId },
            relations: ['tiendas']});
        if (!producto)
          throw new BusinessLogicException("El producto con el id dado no fue encontrado", BusinessError.NOT_FOUND)
    
        return producto.tiendas
      }
    
      async updateTiendasFromProducto(productoId: number, tiendas: TiendaEntity[]): Promise<ProductoEntity> {
        const producto = await this.productoRepository.findOne({
            where: { id: productoId },
            relations: ['tiendas']});
    
        if (!producto)
          throw new BusinessLogicException("El producto con el id dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for(let tiendaEntity of tiendas) {
          const tienda = await this.tiendaRepository.findOne({where: { id: tiendaEntity.id }});
          if (!tienda) 
            throw new BusinessLogicException("La tienda con el id dado no fue encontrada", BusinessError.NOT_FOUND) 
        }
    
        producto.tiendas = tiendas;
        return await this.productoRepository.save(producto);
      }
    
      async deleteTiendaFromProducto(productoId: number, tiendaId: number) {
        const producto = await this.productoRepository.findOne({ where: { id: productoId }, relations: ['tiendas'] });
        if (!producto)
            throw new BusinessLogicException("El producto con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        const tienda = await this.tiendaRepository.findOne({ where: { id: tiendaId } });
        if (!tienda)
            throw new BusinessLogicException("La tienda con el id dado no fue encontrada", BusinessError.NOT_FOUND);
        const tiendaIndex = producto.tiendas.find(tiendaEntity => tiendaEntity.id === tiendaId);
        if (!tiendaIndex)
            throw new BusinessLogicException("La tienda con el id dado no esta asociada al producto", BusinessError.PRECONDITION_FAILED);
      
        producto.tiendas = producto.tiendas.filter(e => e.id !== tiendaId);

        await this.productoRepository.save(producto);
    }

}
