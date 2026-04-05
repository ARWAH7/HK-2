import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BomDetailEntity } from './bom-detail.entity';

@Entity('bom_header')
export class BomHeaderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bom_code' })
  bomCode: string;

  @Column({ name: 'spec_id' })
  specId: string;

  @Column({ name: 'process_type' })
  processType: string;

  @Column({ name: 'version_no', default: 'V1' })
  versionNo: string;

  @Column({ name: 'status', type: 'smallint', default: 1 })
  status: number;

  @Column({ name: 'remark', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BomDetailEntity, (detail) => detail.header, { cascade: true })
  details: BomDetailEntity[];
}
