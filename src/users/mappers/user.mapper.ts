import { UserEntity } from "../entities/user.entity"

export class UserMapper{

    static toEntity(id: number, dto: any){
        return new UserEntity();
    }

    static toResponse (entity: UserEntity){
        return{
            id: entity.id,
            name: entity.name,
            email: entity.email
        }
    }
}

