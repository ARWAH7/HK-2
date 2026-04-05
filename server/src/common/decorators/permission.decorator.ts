import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission_code';
export const RequirePermission = (code: string) => SetMetadata(PERMISSION_KEY, code);
