import { PrimaryGeneratedColumn, Column, OneToMany, Entity, ManyToOne, JoinColumn } from "typeorm";
import { ItemTypes } from "./item-type.entity";
import { ItemVariation } from "./item-variation.entity";

@Entity('items')
export class ItemsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @ManyToOne(() => ItemTypes, (itemType) => itemType.items)
    @JoinColumn({ name: 'item_type_id' })
    itemType: ItemTypes;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => ItemVariation, itemVariation => itemVariation.item)
    itemVariations: ItemVariation[];
}
