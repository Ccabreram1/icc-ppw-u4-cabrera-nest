import { Product } from "../entities/product.entity";


export class ProductMapper{

    static toEntity(id: number, dto: any){
        return new Product(id, dto.name, dto.description, dto.price);
    }

    static toResponse (entity: Product){
        return{
            id: entity.id,
            name: entity.name,
            description: entity.description
        }
    }
}