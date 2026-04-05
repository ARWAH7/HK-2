import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { ProductSpecEntity } from '../specs/entities/product-spec.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly itemRepo: Repository<OrderItemEntity>,
    @InjectRepository(ProductSpecEntity)
    private readonly specRepo: Repository<ProductSpecEntity>,
  ) {}

  async create(dto: CreateOrderDto, userId?: string) {
    const order = this.orderRepo.create({
      orderNo: dto.orderNo,
      customerName: dto.customerName,
      orderDate: dto.orderDate,
      deliveryDate: dto.deliveryDate,
      remark: dto.remark,
      status: 'confirmed',
      createdBy: userId,
    });

    const savedOrder = await this.orderRepo.save(order);

    for (const item of dto.items) {
      const spec = await this.specRepo.findOne({ where: { id: item.specId } });
      const entity = this.itemRepo.create({
        order: savedOrder,
        spec,
        quantity: item.quantity,
        unit: item.unit,
        plannedRollCount: item.plannedRollCount || 0,
        plannedMeter: item.plannedMeter || 0,
        plannedWeight: item.plannedWeight || 0,
        remark: item.remark,
      });
      await this.itemRepo.save(entity);
    }

    return this.findDetail(savedOrder.id);
  }

  async findAll() {
    return this.orderRepo.find({
      relations: { items: { spec: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findDetail(id: string) {
    return this.orderRepo.findOne({
      where: { id },
      relations: { items: { spec: true } },
    });
  }
}
