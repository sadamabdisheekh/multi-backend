import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.entity";

@Entity()
export class ItemTypes {
    @PrimaryGeneratedColumn()
    item_type_id: number;
    @Column({length: 100})
    name: string

    @Column({default: true})
    isActive: boolean

    @OneToMany(() => Item, (item) => item.itemType)
    items: Item[];
}