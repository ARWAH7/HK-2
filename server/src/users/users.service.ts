import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './entities/user.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { RoleEntity } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepo: Repository<UserRoleEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      username: dto.username,
      password: hashed,
      realName: dto.realName,
      mobile: dto.mobile,
      status: dto.status ?? 1,
      remark: dto.remark,
    });

    const saved = await this.userRepo.save(user);

    if (dto.roleIds?.length) {
      const roles = await this.roleRepo.find({ where: { id: In(dto.roleIds) } });
      for (const role of roles) {
        await this.userRoleRepo.save(this.userRoleRepo.create({ user: saved, role }));
      }
    }

    return this.findDetailById(saved.id);
  }

  async findAll() {
    const list = await this.userRepo.find({
      relations: { userRoles: { role: true } },
      order: { createdAt: 'DESC' },
    });

    return list.map((u) => ({
      id: u.id,
      username: u.username,
      realName: u.realName,
      mobile: u.mobile,
      status: u.status,
      remark: u.remark,
      roles: (u.userRoles || []).map((x) => x.role?.name),
      createdAt: u.createdAt,
    }));
  }

  async findByUsernameWithRolesAndPermissions(username: string) {
    return this.userRepo.findOne({
      where: { username },
      relations: {
        userRoles: {
          role: {
            rolePermissions: { permission: true },
          },
        },
      },
    });
  }

  async findDetailById(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: {
        userRoles: {
          role: {
            rolePermissions: { permission: true },
          },
        },
      },
    });

    if (!user) throw new NotFoundException('用户不存在');

    const roles = (user.userRoles || []).map((ur) => ({
      id: ur.role.id,
      code: ur.role.code,
      name: ur.role.name,
    }));

    const permissions = Array.from(new Set(
      (user.userRoles || []).flatMap((ur) =>
        (ur.role.rolePermissions || []).map((rp) => rp.permission.code),
      ),
    ));

    return {
      id: user.id,
      username: user.username,
      realName: user.realName,
      mobile: user.mobile,
      status: user.status,
      roles,
      permissions,
    };
  }
}
