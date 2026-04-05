import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialTheoreticalEntity } from './entities/material-theoretical.entity';
import { MaterialActualEntity } from './entities/material-actual.entity';
import { MaterialVarianceEntity } from './entities/material-variance.entity';
import { ProductSpecEntity } from '../specs/entities/product-spec.entity';
import { MaterialAnalysisService } from './material-analysis.service';
import { MaterialAnalysisController } from './material-analysis.controller';
import { OrdersModule } from '../orders/orders.module';
import { BomModule } from '../bom/bom.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaterialTheoreticalEntity,
      MaterialActualEntity,
      MaterialVarianceEntity,
      ProductSpecEntity,
    ]),
    OrdersModule,
    BomModule,
  ],
  providers: [MaterialAnalysisService],
  controllers: [MaterialAnalysisController],
})
export class MaterialAnalysisModule {}
