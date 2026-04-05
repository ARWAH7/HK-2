import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('material_actual')
export class MaterialActualEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'order_item_id', nullable: true })
  orderItemId: string;

  @Column({ name: 'spec_id', nullable: true })
  specId: string;

  @Column({ name: 'process_type' })
  processType: string;

  @Column({ name: 'material_id' })
  materialId: string;

  @Column({ name: 'quantity', type: 'numeric', default: 0 })
  quantity: number;

  @Column({ name: 'unit' })
  unit: string;

  @Column({ name: 'report_date', type: 'date' })
  reportDate: string;

  @Column({ name: 'remark', nullable: true })
  remark: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
