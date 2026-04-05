import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('roll')
export class RollEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'order_item_id' })
  orderItemId: string;

  @Column({ name: 'spec_id' })
  specId: string;

  @Column({ name: 'roll_no' })
  rollNo: string;

  @Column({ name: 'seq_no' })
  seqNo: number;

  @Column({ name: 'length_m', type: 'numeric', default: 0 })
  lengthM: number;

  @Column({ name: 'weight_kg', type: 'numeric', default: 0 })
  weightKg: number;

  @Column({ name: 'status', default: 'created' })
  status: string;

  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: string;

  @Column({ name: 'location_id', nullable: true })
  locationId: string;

  @Column({ name: 'qr_code', nullable: true })
  qrCode: string;

  @Column({ name: 'remark', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
