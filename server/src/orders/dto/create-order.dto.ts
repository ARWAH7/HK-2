import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  specId: string;

  quantity: number;
  unit: string;
  plannedRollCount?: number;
  plannedMeter?: number;
  plannedWeight?: number;
  remark?: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  orderNo: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsDateString()
  orderDate: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
