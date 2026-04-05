import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequirePermission } from '../common/decorators/permission.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermission('user:view')
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @RequirePermission('user:create')
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
