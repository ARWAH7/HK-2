import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsernameWithRolesAndPermissions(username);
    if (!user) throw new UnauthorizedException('用户名或密码错误');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('用户名或密码错误');
    if (user.status !== 1) throw new UnauthorizedException('账号已停用');

    const permissions = Array.from(new Set(
      (user.userRoles || []).flatMap((ur: any) =>
        (ur.role?.rolePermissions || []).map((rp: any) => rp.permission.code),
      ),
    ));

    const roles = (user.userRoles || []).map((ur: any) => ur.role.code);

    const tokenPayload = {
      sub: user.id,
      username: user.username,
      realName: user.realName,
      roles,
      permissions,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      token: accessToken,
      userInfo: tokenPayload,
    };
  }

  async profile(userId: string) {
    return this.usersService.findDetailById(userId);
  }
}
