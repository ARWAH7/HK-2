import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialMasterEntity } from './entities/material-master.entity';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(MaterialMasterEntity)
    private readonly materialRepo: Repository<MaterialMasterEntity>,
  ) {}

  async findAll() {
    return this.materialRepo.find({ order: { createdAt: 'DESC' } });
  }

  async create(body: Partial<MaterialMasterEntity>) {
    const entity = this.materialRepo.create(body);
    return this.materialRepo.save(entity);
  }
}
