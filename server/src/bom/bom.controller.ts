import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { BomService } from './bom.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequirePermission } from '../common/decorators/permission.decorator';
import { CreateBomDto } from './dto/create-bom.dto';

@Controller('bom')
@UseGuards(JwtAuthGuard)
export class BomController {
  constructor(private readonly bomService: BomService) {}

  @Get()
  @RequirePermission('bom:view')
  async findAll() {
    return this.bomService.findAll();
  }

  @Post()
  @RequirePermission('bom:create')
  async create(@Body() dto: CreateBomDto) {
    return this.bomService.create(dto);
  }

  @Get('by-spec-process')
  @RequirePermission('bom:view')
  async bySpecProcess(@Query('specId') specId: string, @Query('processType') processType: string) {
    return this.bomService.findBySpecAndProcess(specId, processType);
  }
}
