import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BomDetailDto {
  materialId: string;
  calcBasis: string;
  numerator: number;
  denominator: number;
  fixedValue?: number;
  lossRate?: number;
  sortNo?: number;
  remark?: string;
}

export class CreateBomDto {
  @IsString()
  @IsNotEmpty()
  bomCode: string;

  @IsString()
  @IsNotEmpty()
  specId: string;

  @IsString()
  @IsNotEmpty()
  processType: string;

  @IsString()
  versionNo: string;

  remark?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BomDetailDto)
  details: BomDetailDto[];
}
