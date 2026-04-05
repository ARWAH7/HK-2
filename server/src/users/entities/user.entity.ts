import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRoleEntity } from './user-role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'real_name' })
  realName: string;

  @Column({ name: 'mobile', nullable: true })
  mobile: string;

  @Column({ name: 'status', type: 'smallint', default: 1 })
  status: number;

  @Column({ name: 'remark', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserRoleEntity, (ur) => ur.user)
  userRoles: UserRoleEntity[];
}
