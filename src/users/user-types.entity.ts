import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_types')
export class UserType {
    @PrimaryGeneratedColumn()
    userTypeId: number;

    @Column()
    name: string;

    @OneToMany(() => UserEntity, user => user.userType)
    user: UserEntity[];
}