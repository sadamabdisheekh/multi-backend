import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_types')
export class UserType {
    @PrimaryGeneratedColumn()
    userTypeId: number;

    @Column()
    name: string;
}