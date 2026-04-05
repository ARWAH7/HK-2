import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('material_theoretical')
export class MaterialTheoreticalEntity {
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

  @Column({ name: 'source_type', default: 'system' })
  sourceType: string;

  @Column({ name: 'source_id', nullable: true })
  sourceId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
