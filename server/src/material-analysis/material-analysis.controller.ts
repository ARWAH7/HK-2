import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MaterialAnalysisService } from './material-analysis.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequirePermission } from '../common/decorators/permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('material-analysis')
@UseGuards(JwtAuthGuard)
export class MaterialAnalysisController {
  constructor(private readonly service: MaterialAnalysisService) {}

  @Post('calculate')
  @RequirePermission('material-analysis:calculate')
  async calculate(@Body('orderId') orderId: string) {
    return this.service.calculateOrder(orderId);
  }

  @Post('actual')
  @RequirePermission('material-analysis:actual')
  async createActual(@Body() body: any, @CurrentUser() user: any) {
    return this.service.createActual(body, user?.sub);
  }

  @Get('summary')
  @RequirePermission('material-analysis:view')
  async summary(@Query('orderId') orderId: string) {
    return this.service.summary(orderId);
  }
}
