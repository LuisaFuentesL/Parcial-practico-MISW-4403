import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaService } from './producto-tienda.service';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TypeOrmTestingConfig } from '../shared/errors/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let producto: ProductoEntity;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductoTiendaService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDataBase();
  
  });

  const seedDataBase = async () => {
    productoRepository.clear();
    tiendaRepository.clear();
    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(), 
        ciudad: faker.lorem.sentence(), 
        direccion: faker.lorem.sentence(),
      });
      tiendasList.push(tienda);
    }

    producto = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.number.int(),
      tipo:  faker.string.sample(3).toUpperCase(),
      tiendas: tiendasList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addTiendaToProducto should return a producto with the tienda added', async () => {
    const tienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.lorem.sentence(), 
      direccion: faker.lorem.sentence(),
    });

    const updatedProducto = await service.addTiendaToProducto(producto.id, tienda.id);
    expect(updatedProducto.tiendas.length).toEqual(tiendasList.length + 1);
  });

  it('addTiendaToProducto should throw an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.lorem.sentence(), 
      direccion: faker.lorem.sentence(),
    });

    await expect(service.addTiendaToProducto(0, tienda.id)).rejects.toHaveProperty("message", "El producto con el id dado no fue encontrado");
  });

  it('addTiendaToProducto should throw an exception for an invalid tienda', async () => {
    await expect(service.addTiendaToProducto(producto.id, 0)).rejects.toHaveProperty("message", "La tienda con el id dado no fue encontrada");
  });

  it('findTiendasFromProducto should return a list of tiendas from a producto', async () => {
    const tiendas = await service.findTiendasFromProducto(producto.id);
    expect(tiendas.length).toEqual(tiendasList.length);
  });

  it('findTiendasFromProducto should throw an exception for an invalid producto', async () => {
    await expect(service.findTiendasFromProducto(0)).rejects.toHaveProperty("message", "El producto con el id dado no fue encontrado");
  });

  it('findTiendaFromProducto should return a tienda from a producto', async () => {
    const tienda = tiendasList[0];
    const storedTienda = await service.findTiendaFromProducto(producto.id, tienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre)
    expect(tienda.ciudad).toEqual(storedTienda.ciudad)
    expect(tienda.direccion).toEqual(storedTienda.direccion)
  });

  it('findTiendaFromProducto should throw an exception for an invalid producto', async () => {
    const tienda = tiendasList[0];
    await expect(service.findTiendaFromProducto(0, tienda.id)).rejects.toHaveProperty("message", "El producto con el id dado no fue encontrado");
  });

  it('findTiendaFromProducto should throw an exception for an invalid tienda', async () => {
    await expect(service.findTiendaFromProducto(producto.id, 0)).rejects.toHaveProperty("message", "La tienda con el id dado no fue encontrada");
  });

  it('findTiendaFromProducto should throw an exception for a non associated tienda', async () => {
    const tienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.lorem.sentence(), 
      direccion: faker.lorem.sentence(),
    });

    await expect(service.findTiendaFromProducto(producto.id, tienda.id)).rejects.toHaveProperty("message", "La tienda con el id dado no esta asociada al producto");
  });

  it('updateTiendasFromProducto should return a producto with the tiendas updated', async () => {
    const tienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.lorem.sentence(), 
      direccion: faker.lorem.sentence(),
    });

    const updatedProducto = await service.updateTiendasFromProducto(producto.id, [tienda]);
    expect(updatedProducto.tiendas.length).toEqual(1);
    expect(updatedProducto.tiendas[0].nombre).toEqual(tienda.nombre);
    expect(updatedProducto.tiendas[0].ciudad).toEqual(tienda.ciudad);
    expect(updatedProducto.tiendas[0].direccion).toEqual(tienda.direccion);
  });

  it('updateTiendasFromProducto should throw an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.lorem.sentence(), 
      direccion: faker.lorem.sentence(),
    });

    await expect(service.updateTiendasFromProducto(0, [tienda])).rejects.toHaveProperty("message", "El producto con el id dado no fue encontrado");
  });

  it('updateTiendasFromProducto should throw an exception for an invalid tienda', async () => {
    const tienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.lorem.sentence(), 
      direccion: faker.lorem.sentence(),
    });

    await expect(service.updateTiendasFromProducto(producto.id, [tienda, { id: 0 } as TiendaEntity])).rejects.toHaveProperty("message", "La tienda con el id dado no fue encontrada");
  });

  it('deleteTiendaFromProducto should delete a tienda from a producto', async () => {
    const tienda = tiendasList[0];

    await service.deleteTiendaFromProducto(producto.id, tienda.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({ where: { id: producto.id }, relations: ['tiendas'] });
    const deletedTienda = storedProducto.tiendas.find(a => a.id === tienda.id);

    expect(deletedTienda).toBeUndefined();
  });

  it('deleteTiendaFromProducto should throw an exception for an invalid producto', async () => {
    const tienda = tiendasList[0];
    await expect(service.deleteTiendaFromProducto(0, tienda.id)).rejects.toHaveProperty("message", "El producto con el id dado no fue encontrado");
  });

  it('deleteTiendaFromProducto should throw an exception for an invalid tienda', async () => {
    await expect(service.deleteTiendaFromProducto(producto.id, 0)).rejects.toHaveProperty("message", "La tienda con el id dado no fue encontrada");
  });
  
  it('deleteTiendaFromProducto should throw an exception for a non associated producto', async () => {
    const tienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.lorem.sentence(), 
      direccion: faker.lorem.sentence(),
    });

    await expect(service.deleteTiendaFromProducto(producto.id, tienda.id)).rejects.toHaveProperty("message", "La tienda con el id dado no esta asociada al producto");
  });

  
});
