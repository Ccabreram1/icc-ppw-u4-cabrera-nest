import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {

  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100)
  name: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString()
  @MinLength(5)
  description: string;

  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;
}