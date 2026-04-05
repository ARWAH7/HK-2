import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSpecEntity } from './entities/product-spec.entity';

@Injectable()
export class SpecsService {
  constructor(
    @InjectRepository(ProductSpecEntity)
    private readonly specRepo: Repository<ProductSpecEntity>,
  ) {}

  async findAll() {
    return this.specRepo.find({ order: { createdAt: 'DESC' } });
  }

  async create(body: Partial<ProductSpecEntity>) {
    const entity = this.specRepo.create(body);
    return this.specRepo.save(entity);
  }
}
