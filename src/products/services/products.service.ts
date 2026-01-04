import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Product } from '../models/product.model';
import { CreateProductDto } from '../dtos/create-products.dto';
import { UpdateProductDTO } from '../dtos/update-products-dto';
import { PartialUpdateProductsDto } from '../dtos/partial-update-products.dto';
import { ProductResponseDto } from '../dtos/products-response.dto';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const entities = await this.productRepository.find();

    return entities
      .map(Product.fromEntity)
      .map(product => product.toResponseDto());
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return Product.fromEntity(entity).toResponseDto();
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {

    const exists = await this.productRepository.exist({
    where: { name: dto.name },
  });

  if (exists) {
    throw new ConflictException(
      `Ya existe un producto con el nombre: ${dto.name}`,
    );
  }


    if (dto.price <= 0) {
    throw new Error('El precio debe ser mayor a 0');
  }

  if (dto.stock !== undefined && dto.stock < 0) {
    throw new Error('El stock no puede ser negativo');
  }
    const product = Product.fromDto(dto);
    const saved = await this.productRepository.save(product.toEntity());

    return Product.fromEntity(saved).toResponseDto();
  }

  async update(id: number, dto: UpdateProductDTO): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

      if (dto.price <= 0) {
    throw new Error('El precio debe ser mayor a 0');
  }

  if (dto.stock < 0) {
    throw new Error('El stock no puede ser negativo');
  }

    const updated = Product.fromEntity(entity)
      .update(dto)
      .toEntity();

    const saved = await this.productRepository.save(updated);

    return Product.fromEntity(saved).toResponseDto();
  }

  async partialUpdate(
    id: number,
    dto: PartialUpdateProductsDto,
  ): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (dto.price !== undefined && dto.price <= 0) {
    throw new Error('El precio debe ser mayor a 0');
  }

  if (dto.stock !== undefined && dto.stock < 0) {
    throw new Error('El stock no puede ser negativo');
  }

    const updated = Product.fromEntity(entity)
      .partialUpdate(dto)
      .toEntity();

    const saved = await this.productRepository.save(updated);

    return Product.fromEntity(saved).toResponseDto();
  }

  async delete(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}




// import { Injectable } from '@nestjs/common';
// import {  ProductEntity } from '../entities/product.entity';
// import { ProductMapper } from '../mappers/product.mapper';
// import { PartialUpdateProductsDto } from '../dtos/partial-update-products.dto';
// import { CreateProductDto } from '../dtos/create-products.dto';
// import { UpdateProductDTO } from '../dtos/update-products-dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { read } from 'fs';
// import { Repository } from 'typeorm';

// @Injectable()
// export class ProductsService {

//     private products: ProductEntity[] = [];
//     private currentId = 1;

//     constructor(
//         @InjectRepository(ProductEntity)
//         private readonly productRepository: Repository<ProductEntity>,
//     ) {}
    
//     findAll() {
//         return this.products.map(p => ProductMapper.toResponse(p));
//     }

//     findOne(id: number) {
//         const product = this.products.find(p => p.id === id);
//         if (!product) return { error: 'Product not found' };
//         return ProductMapper.toResponse(product);
//     }

//     create(dto: CreateProductDto) {
//         const entity = ProductMapper.toEntity(this.currentId++, dto);
//         this.products.push(entity);
//         return ProductMapper.toResponse(entity);
//     }

//     update(id: number, dto: UpdateProductDTO) {
//         const product = this.products.find(p => p.id === id);
//         if (!product) return { error: 'Product not found' };

//         product.name = dto.name;
//         product.description = dto.description;
//         product.price = dto.price;

//         return ProductMapper.toResponse(product);
//     }

//     partialUpdate(id: number, dto: PartialUpdateProductsDto) {
//         const product = this.products.find(p => p.id === id);
//         if (!product) return { error: 'Product not found' };

//         if (dto.name !== undefined) product.name = dto.name;
//         if (dto.description !== undefined) product.description = dto.description;
//         if (dto.price !== undefined) product.price = dto.price;

//         return ProductMapper.toResponse(product);
//     }

//     delete(id: number) {
//         const exists = this.products.some(p => p.id === id);
//         if (!exists) return { error: 'Product not found' };

//         this.products = this.products.filter(p => p.id !== id);
//         return { message: 'Deleted successfully' };
//     }
// }
