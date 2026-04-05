import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequirePermission } from '../common/decorators/permission.decorator';

@Controller('materials')
@UseGuards(JwtAuthGuard)
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  @RequirePermission('material:view')
  async findAll() {
    return this.materialsService.findAll();
  }

  @Post()
  @RequirePermission('material:create')
  async create(@Body() body: any) {
    return this.materialsService.create(body);
  }
}
