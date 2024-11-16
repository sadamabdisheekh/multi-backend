import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { UserProfile } from "./user-profile.entity";

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
    @CreateDateColumn({ type: 'timestamp' })
    datecreated: Date;
    @UpdateDateColumn({ type: 'timestamp' })
    dateModified: Date;
    @Column()
    @Unique(['mobile'])
    mobile: string;
    @Column()
    password: string;

    @OneToOne(() => UserProfile, profile => profile.user)
    profile: UserProfile;

}