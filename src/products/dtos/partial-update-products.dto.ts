import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';

export class PartialUpdateProductsDto {

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}
