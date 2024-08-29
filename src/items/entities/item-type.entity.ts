import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ItemTypes {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({length: 100})
    name: string

    @Column({default: true})
    isActive: boolean
}