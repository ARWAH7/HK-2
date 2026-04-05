import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { PermissionGuard } from './common/guards/permission.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new PermissionGuard(reflector));
  await app.listen(process.env.PORT || 3000);
  console.log(`服务启动成功: http://localhost:${process.env.PORT || 3000}/api`);
}
bootstrap();
