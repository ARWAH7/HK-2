import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('material_master')
export class MaterialMasterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'material_code' })
  materialCode: string;

  @Column({ name: 'material_name' })
  materialName: string;

  @Column({ name: 'category' })
  category: string;

  @Column({ name: 'base_unit' })
  baseUnit: string;

  @Column({ name: 'status', type: 'smallint', default: 1 })
  status: number;

  @Column({ name: 'remark', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
