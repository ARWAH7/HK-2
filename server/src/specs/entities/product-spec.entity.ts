import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('product_spec')
export class ProductSpecEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'spec_code' })
  specCode: string;

  @Column({ name: 'spec_name' })
  specName: string;

  @Column({ name: 'width_cm', type: 'numeric', nullable: true })
  widthCm: number;

  @Column({ name: 'weight_gsm', type: 'numeric', nullable: true })
  weightGsm: number;

  @Column({ name: 'roll_length_m', type: 'numeric', nullable: true })
  rollLengthM: number;

  @Column({ name: 'piece_per_pack', default: 0 })
  piecePerPack: number;

  @Column({ name: 'pack_per_box', default: 0 })
  packPerBox: number;

  @Column({ name: 'remark', nullable: true })
  remark: string;

  @Column({ name: 'status', type: 'smallint', default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
