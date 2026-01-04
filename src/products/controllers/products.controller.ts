import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ProductEntity } from '../entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { PartialUpdateProductsDto } from '../dtos/partial-update-products.dto';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/create-products.dto';
import { UpdateProductDTO } from '../dtos/update-products-dto';

@Controller('products')
export class ProductsController {

     constructor(private readonly service: ProductsService) {}

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(Number(id));
    }

    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductDTO) {
        return this.service.update(Number(id), dto);
    }

    @Patch(':id')
    partialUpdate(
        @Param('id') id: number,
        @Body() dto: PartialUpdateProductsDto
    ) {
        return this.service.partialUpdate(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(Number(id));
    }


}

// @Controller('products')
// export class ProductsController {
//     private products: Product[] = [];
//     private currentId = 1;

//     @Get()
//     findAll() {
//         return this.products.map(product => ProductMapper.toResponse(product)) //Me devuelve todos los producto
//     }

//     @Get(':id')
//     findOne(@Param('id') id: string) {
//         const product = this.products.find(p => p.id === Number(id));
//         if (!product) return { error: 'Product not found' };

//         return ProductMapper.toResponse(product);
//     }


//     @Post()
//     create(@Body() dto: CreateProductsDto) {
//         const entity = ProductMapper.toEntity(this.currentId++, dto);
//         this.products.push(entity);
//         return ProductMapper.toResponse(entity);
//     }

//     @Patch(':id')
//     PartialUpdate(@Param('id') id: string, @Body() dto: PartialUpdateProductsDto) {
//         const product = this.products.find(p => p.id === Number(id));
//         if (!product) return { error: 'Product not found' };

//         if (dto.name !== undefined) product.name = dto.name;
//         if (dto.email !== undefined) product.email = dto.email;

//         return ProductMapper.toResponse(product);

//     }

//     @Delete(':id')
//     remove(@Param('id') id: string) {
//         const exists = this.products.some(p => p.id === Number(id));
//         if (!exists) return { error: 'Product not found' };

//         this.products = this.products.filter(p => p.id !== Number(id));
//         return { message: 'Deleted successfully' };
//     }
// }
