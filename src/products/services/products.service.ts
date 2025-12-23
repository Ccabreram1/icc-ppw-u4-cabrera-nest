import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { PartialUpdateProductsDto } from '../dtos/partial-update-products.dto';
import { CreateProductDto } from '../dtos/create-products.dto';
import { UpdateProductDTO } from '../dtos/update-products-dto';

@Injectable()
export class ProductsService {

    private products: Product[] = [];
    private currentId = 1;

    constructor(){
        this.products = [
            ProductMapper.toEntity(this.currentId++, {name: 'Laptop', description: 'Asus rog strix g16', price: '999.99'}),
            ProductMapper.toEntity(this.currentId++, {name: 'Monitor', description: 'Monitor gamer de alta resolución', price: '299.99'}),
            ProductMapper.toEntity(this.currentId++, {name: 'Keyboard', description: 'Teclado mecánico para gaming', price: '39.99'}),
            ProductMapper.toEntity(this.currentId++, {name: 'Mouse',description: 'Mouse gamer de alta precisión',price: '29.99'}),
            ProductMapper.toEntity(this.currentId++, {name: 'Headset',description: 'Audífonos gamer con micrófono',price: '59.99'}),
        ];
    }
    
    findAll() {
        return this.products.map(p => ProductMapper.toResponse(p));
    }

    findOne(id: number) {
        const product = this.products.find(p => p.id === id);
        if (!product) return { error: 'Product not found' };
        return ProductMapper.toResponse(product);
    }

    create(dto: CreateProductDto) {
        const entity = ProductMapper.toEntity(this.currentId++, dto);
        this.products.push(entity);
        return ProductMapper.toResponse(entity);
    }

    update(id: number, dto: UpdateProductDTO) {
        const product = this.products.find(p => p.id === id);
        if (!product) return { error: 'Product not found' };

        product.name = dto.name;
        product.description = dto.description;
        product.price = dto.price;

        return ProductMapper.toResponse(product);
    }

    partialUpdate(id: number, dto: PartialUpdateProductsDto) {
        const product = this.products.find(p => p.id === id);
        if (!product) return { error: 'Product not found' };

        if (dto.name !== undefined) product.name = dto.name;
        if (dto.description !== undefined) product.description = dto.description;
        if (dto.price !== undefined) product.price = dto.price;

        return ProductMapper.toResponse(product);
    }

    delete(id: number) {
        const exists = this.products.some(p => p.id === id);
        if (!exists) return { error: 'Product not found' };

        this.products = this.products.filter(p => p.id !== id);
        return { message: 'Deleted successfully' };
    }
}
