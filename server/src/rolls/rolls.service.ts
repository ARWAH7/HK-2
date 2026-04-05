import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RollEntity } from './entities/roll.entity';

@Injectable()
export class RollsService {
  constructor(
    @InjectRepository(RollEntity)
    private readonly rollRepo: Repository<RollEntity>,
  ) {}

  async findAll() {
    return this.rollRepo.find({ order: { createdAt: 'DESC' } });
  }

  async generateRolls(body: {
    orderId: string;
    orderItemId: string;
    specId: string;
    orderNo: string;
    specCode: string;
    count: number;
  }) {
    const result = [];
    for (let i = 1; i <= body.count; i++) {
      const rollNo = `${body.orderNo}-${body.specCode}-${String(i).padStart(4, '0')}`;
      const entity = this.rollRepo.create({
        orderId: body.orderId,
        orderItemId: body.orderItemId,
        specId: body.specId,
        rollNo,
        seqNo: i,
        status: 'created',
        qrCode: rollNo,
      });
      result.push(await this.rollRepo.save(entity));
    }
    return result;
  }
}
