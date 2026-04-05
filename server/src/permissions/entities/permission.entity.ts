import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RolePermissionEntity } from '../../roles/entities/role-permission.entity';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'path', nullable: true })
  path: string;

  @Column({ name: 'method', nullable: true })
  method: string;

  @Column({ name: 'icon', nullable: true })
  icon: string;

  @Column({ name: 'sort_no', default: 0 })
  sortNo: number;

  @Column({ name: 'visible', default: true })
  visible: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => RolePermissionEntity, (rp) => rp.permission)
  rolePermissions: RolePermissionEntity[];
}
