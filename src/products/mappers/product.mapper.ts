import { ProductEntity } from "../entities/product.entity";


export class ProductMapper{

    static toEntity(id: number, dto: any ){
        return new ProductEntity();
    }

    static toResponse (entity: ProductEntity){
        return{
            id: entity.id,
            name: entity.name,
            description: entity.description,
            price: entity.price,
            stock: entity.stock,
            createdAt: entity.createdAt,
        }
    }
}