import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderItemEntity } from './order-item.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_no' })
  orderNo: string;

  @Column({ name: 'customer_name', nullable: true })
  customerName: string;

  @Column({ name: 'order_date', type: 'date' })
  orderDate: string;

  @Column({ name: 'delivery_date', type: 'date', nullable: true })
  deliveryDate: string;

  @Column({ name: 'status', default: 'draft' })
  status: string;

  @Column({ name: 'remark', nullable: true })
  remark: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items: OrderItemEntity[];
}
