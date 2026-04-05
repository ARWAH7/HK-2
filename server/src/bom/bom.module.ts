import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BomHeaderEntity } from './entities/bom-header.entity';
import { BomDetailEntity } from './entities/bom-detail.entity';
import { BomController } from './bom.controller';
import { BomService } from './bom.service';

@Module({
  imports: [TypeOrmModule.forFeature([BomHeaderEntity, BomDetailEntity])],
  controllers: [BomController],
  providers: [BomService],
  exports: [BomService, TypeOrmModule],
})
export class BomModule {}
