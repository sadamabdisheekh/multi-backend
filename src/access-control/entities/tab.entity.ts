import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Menu } from './menu.entity';
import { TabPermission } from './tab-permission.entity';

@Entity('tabs')
export class Tab {
  @PrimaryGeneratedColumn()
  tabId: number;

  @Column()
  tabName: string;

  @Column()
  tabOrder: number;

  @ManyToOne(() => Menu, menu => menu.tabs)
  @JoinColumn({ name: 'MENUID' })
  menu: Menu;

  @Column()
  path: string;
  @Column()
  title: string;
  @Column({ nullable: true})
  iconType: string;
  @Column({ nullable: true})
  icon: string;
  @Column({ default: 'ml-menu'})
  class: string;
  @Column({ nullable: true})
  groupTitle: string;
  @Column({ nullable: true})
  badge: string;
  @Column({ nullable: true})
  badgeClass: string;

  @OneToMany(() => TabPermission, tabPermission => tabPermission.tab)
  tabPermissions: TabPermission[];
}