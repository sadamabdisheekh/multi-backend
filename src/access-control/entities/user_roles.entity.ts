import { UserEntity } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity('user_roles')
export class UserRoles {
    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(() => UserEntity, user => user.userRole)
    @JoinColumn({name: 'userId'})
    user: UserEntity;

    @ManyToOne(() => Role, role => role.userRole)
    @JoinColumn({name: 'roleId'})
    role: Role;
}