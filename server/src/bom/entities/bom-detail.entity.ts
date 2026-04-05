import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BomHeaderEntity } from './bom-header.entity';

@Entity('bom_detail')
export class BomDetailEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BomHeaderEntity, (header) => header.details)
  @JoinColumn({ name: 'bom_header_id' })
  header: BomHeaderEntity;

  @Column({ name: 'material_id' })
  materialId: string;

  @Column({ name: 'calc_basis' })
  calcBasis: string;

  @Column({ name: 'numerator', type: 'numeric', default: 1 })
  numerator: number;

  @Column({ name: 'denominator', type: 'numeric', default: 1 })
  denominator: number;

  @Column({ name: 'fixed_value', type: 'numeric', default: 0 })
  fixedValue: number;

  @Column({ name: 'loss_rate', type: 'numeric', default: 0 })
  lossRate: number;

  @Column({ name: 'sort_no', default: 0 })
  sortNo: number;

  @Column({ name: 'remark', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
