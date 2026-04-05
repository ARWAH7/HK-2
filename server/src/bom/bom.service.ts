import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BomHeaderEntity } from './entities/bom-header.entity';
import { BomDetailEntity } from './entities/bom-detail.entity';
import { CreateBomDto } from './dto/create-bom.dto';

@Injectable()
export class BomService {
  constructor(
    @InjectRepository(BomHeaderEntity)
    private readonly bomHeaderRepo: Repository<BomHeaderEntity>,
    @InjectRepository(BomDetailEntity)
    private readonly bomDetailRepo: Repository<BomDetailEntity>,
  ) {}

  async create(dto: CreateBomDto) {
    const header = this.bomHeaderRepo.create({
      bomCode: dto.bomCode,
      specId: dto.specId,
      processType: dto.processType,
      versionNo: dto.versionNo || 'V1',
      remark: dto.remark,
      status: 1,
    });

    const savedHeader = await this.bomHeaderRepo.save(header);

    for (const item of dto.details) {
      const detail = this.bomDetailRepo.create({
        header: savedHeader,
        materialId: item.materialId,
        calcBasis: item.calcBasis,
        numerator: item.numerator,
        denominator: item.denominator,
        fixedValue: item.fixedValue || 0,
        lossRate: item.lossRate || 0,
        sortNo: item.sortNo || 0,
        remark: item.remark,
      });
      await this.bomDetailRepo.save(detail);
    }

    return this.findAll();
  }

  async findAll() {
    return this.bomHeaderRepo.find({
      relations: { details: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySpecAndProcess(specId: string, processType: string) {
    return this.bomHeaderRepo.findOne({
      where: { specId, processType, status: 1 },
      relations: { details: true },
      order: { createdAt: 'DESC' },
    });
  }
}
