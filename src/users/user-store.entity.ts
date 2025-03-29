import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, Unique, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {UserEntity} from "./user.entity";
import { Store } from 'src/stores/entities/store.entity';

@Entity('user_stores')
export class UserStore {
    @PrimaryGeneratedColumn()
    userStoreId: number;

    @ManyToOne(() => Store, store => store.userStore)
    @JoinColumn({name: 'storeId'}) // Specify the foreign key column
    store: Store;

    @OneToOne(() => UserEntity, user => user.userStore)
    @JoinColumn({name: 'userId'}) // Specify the foreign key column
    user: UserEntity;

    @CreateDateColumn({ type: 'timestamp' })
    datecreated: Date;
    @UpdateDateColumn({type: 'timestamp'})
    dateModified: Date;

}
