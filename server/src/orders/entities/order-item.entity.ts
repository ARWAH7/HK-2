import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductSpecEntity } from '../../specs/entities/product-spec.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => ProductSpecEntity)
  @JoinColumn({ name: 'spec_id' })
  spec: ProductSpecEntity;

  @Column({ name: 'quantity', type: 'numeric', default: 0 })
  quantity: number;

  @Column({ name: 'unit' })
  unit: string;

  @Column({ name: 'planned_roll_count', default: 0 })
  plannedRollCount: number;

  @Column({ name: 'planned_meter', type: 'numeric', default: 0 })
  plannedMeter: number;

  @Column({ name: 'planned_weight', type: 'numeric', default: 0 })
  plannedWeight: number;

  @Column({ name: 'remark', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
