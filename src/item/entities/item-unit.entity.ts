import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Item } from "./item.entity";

@Entity()
export class ItemUnit {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({length: 100})
    name: string

    @Column({default: true})
    isActive: boolean

    @OneToMany(() => Item, (item) => item.itemUnit)
    items: Item[];
}