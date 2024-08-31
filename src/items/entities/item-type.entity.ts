import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItemsEntity } from "./item.entity";

@Entity()
export class ItemTypes {
    @PrimaryGeneratedColumn()
    item_type_id: number;
    @Column({length: 100})
    name: string

    @Column({default: true})
    isActive: boolean

    @OneToMany(() => ItemsEntity, (item) => item.itemType)
    items: ItemsEntity[];
}