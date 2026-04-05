import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('material_variance')
export class MaterialVarianceEntity {
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

  @Column({ name: 'theoretical_qty', type: 'numeric', default: 0 })
  theoreticalQty: number;

  @Column({ name: 'actual_qty', type: 'numeric', default: 0 })
  actualQty: number;

  @Column({ name: 'variance_qty', type: 'numeric', default: 0 })
  varianceQty: number;

  @Column({ name: 'variance_rate', type: 'numeric', default: 0 })
  varianceRate: number;

  @Column({ name: 'unit' })
  unit: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
