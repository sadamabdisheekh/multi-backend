import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    userId: number;
    @Column({ nullable: true })
    firstName: string;
    @Column()
    middleName: string;
    @Column({ nullable: true })
    lastName: string;
    @Column({ default: true })
    isActive: boolean;
    @Column()
    datecreated: Date;
    @Column({ nullable: true })
    dateModified: Date;
    @Column()
    @Unique(['mobile'])
    mobile: string;
    @Column()
    password: string;

}