import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSpecEntity } from './entities/product-spec.entity';
import { SpecsService } from './specs.service';
import { SpecsController } from './specs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSpecEntity])],
  controllers: [SpecsController],
  providers: [SpecsService],
  exports: [SpecsService, TypeOrmModule],
})
export class SpecsModule {}
