import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SpecsService } from './specs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequirePermission } from '../common/decorators/permission.decorator';

@Controller('specs')
@UseGuards(JwtAuthGuard)
export class SpecsController {
  constructor(private readonly specsService: SpecsService) {}

  @Get()
  @RequirePermission('spec:view')
  async findAll() {
    return this.specsService.findAll();
  }

  @Post()
  @RequirePermission('spec:create')
  async create(@Body() body: any) {
    return this.specsService.create(body);
  }
}
