import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, RolePermissionEntity])],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [TypeOrmModule],
})
export class RolesModule {}
