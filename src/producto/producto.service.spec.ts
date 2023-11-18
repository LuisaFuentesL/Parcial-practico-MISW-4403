/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/errors/testing-utils/typeorm-testing-config';
import { ProductoEntity } from './producto.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for(let i = 0; i < 5; i++){
        const producto: ProductoEntity = await repository.save({
          nombre: faker.company.name(),
          precio: faker.number.int(),
          tipo:  "No perecedero",
      })
        productosList.push(producto);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne should return a producto by id', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre)
    expect(producto.precio).toEqual(storedProducto.precio)
    expect(producto.tipo).toEqual(storedProducto.tipo)
  });

  it('findOne should throw an exception for an invalid producto', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "El producto con el id dado no fue encontrado")
  });

  it('create should return a new producto', async () => {
    const producto: ProductoEntity = {
      id: -1,
      nombre: faker.company.name(),
      precio: faker.number.int(),
      tipo:  "No perecedero",
      tiendas: []
    }

    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({where: {id: newProducto.id}})
    expect(storedProducto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre)
    expect(producto.precio).toEqual(storedProducto.precio)
    expect(producto.tipo).toEqual(storedProducto.tipo)
  });

  it('update should modify a producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = "New name";
    producto.precio = -1;
    producto.tipo = "No perecedero";
  
    const updatedProducto: ProductoEntity = await service.update(producto.id, producto);
    expect(updatedProducto).not.toBeNull();
  
    const storedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(storedProducto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre)
    expect(producto.precio).toEqual(storedProducto.precio)
    expect(producto.tipo).toEqual(storedProducto.tipo)
  });
 
  it('update should throw an exception for an invalid producto', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto, nombre: "New name", precio: -1, tipo: "No perecedero"
    }
    await expect(() => service.update(0, producto)).rejects.toHaveProperty("message", "El producto con el id dado no fue encontrado")
  });

  it('delete should remove a producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
  
    const deletedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(deletedProducto).toBeNull();
  });

  it('delete should throw an exception for an invalid producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "El producto con el id dado no fue encontrado")
  });

 });