import { TiendaEntity } from "../tienda/tienda.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductoEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    precio: number;

    @Column()
    tipo: string;

    @ManyToMany(() => TiendaEntity, tienda => tienda.productos)
    @JoinTable()
    tiendas: TiendaEntity[];

}