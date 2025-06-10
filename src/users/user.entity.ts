import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import {  UserStore } from "./user-store.entity";
import { UserRoles } from "src/access-control/entities/user_roles.entity";
import { UserPermission } from "src/access-control/entities/user-permission.entity";
import { CustomerUser } from "src/customers/entities/customer-users.entity";
import { UserType } from "./user-types.entity";

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

    @Column({unique: true})
    username: string;

    @Column({ default: false })
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

    @OneToOne(() => UserStore, userStore => userStore.user)
    userStore: UserStore;

    @OneToOne(() => UserRoles, userRole => userRole.user)
    userRole: UserRoles

    @OneToMany(() => UserPermission, userPermission => userPermission.user)
    userPermissions: UserPermission[];

    @OneToOne(() => CustomerUser, customerUser => customerUser.user)
    customerUser: CustomerUser;

    @ManyToOne(() => UserType, userType => userType.user)
    @JoinColumn({ name: 'userTypeId' })
    userType: UserType;
}