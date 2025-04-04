import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tab } from './tab.entity';


@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  menuId: number;

  @Column()
  menuName: string;

  @Column({nullable:true})
  description: string;

  @Column({nullable:true})
  route: string;

  @Column()
  menuOrder: number;

  @Column({nullable:true})
  path: string;
  @Column()
  title: string;
  @Column({default: 'material-icons-two-tone'})
  iconType: string;
  @Column({ nullable: true})
  icon: string;
  @Column({default: 'menu-toggle'})
  class: string;
  @Column({ nullable: true})
  groupTitle: string;
  @Column({ nullable: true})
  badge: string;
  @Column({ nullable: true})
  badgeClass: string;

  @OneToMany(() => Tab, tab => tab.menu)
  tabs: Tab[];
}