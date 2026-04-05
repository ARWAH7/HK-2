import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RollEntity } from './entities/roll.entity';
import { RollsController } from './rolls.controller';
import { RollsService } from './rolls.service';

@Module({
  imports: [TypeOrmModule.forFeature([RollEntity])],
  controllers: [RollsController],
  providers: [RollsService],
  exports: [RollsService, TypeOrmModule],
})
export class RollsModule {}
