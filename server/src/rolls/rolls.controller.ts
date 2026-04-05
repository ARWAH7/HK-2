import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RollsService } from './rolls.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequirePermission } from '../common/decorators/permission.decorator';

@Controller('rolls')
@UseGuards(JwtAuthGuard)
export class RollsController {
  constructor(private readonly rollsService: RollsService) {}

  @Get()
  @RequirePermission('roll:view')
  async findAll() {
    return this.rollsService.findAll();
  }

  @Post('generate')
  @RequirePermission('roll:create')
  async generate(@Body() body: any) {
    return this.rollsService.generateRolls(body);
  }
}
