import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ParcelTypes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({default: true})
    isActive: boolean
}