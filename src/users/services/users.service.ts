// import { Injectable } from '@nestjs/common';
// import { UserEntity } from '../entities/user.entity';
// import { UserMapper } from '../mappers/user.mapper';
// import { CreateUserDto } from '../dtos/create-user.dto';
// import { UpdateUserDto } from '../dtos/update-user-dto';
// import { PartialUpdateUserDto } from '../dtos/partial-update-user.dto';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';

// @Injectable()
// export class UsersService {

//   private users: UserEntity[] = [];
//   private currentId = 1;

//   constructor(
//     @InjectRepository(UserEntity)
//     private readonly userRepository: Repository<UserEntity>,
//   ) {}



//   findAll() {
//     return this.users.map(u => UserMapper.toResponse(u));
//   }

//   findOne(id: number) {
//     const user = this.users.find(u => u.id === id);
//     if (!user) return { error: 'User not found' };
//     return UserMapper.toResponse(user);
//   }

//   create(dto: CreateUserDto) {
//     const entity = UserMapper.toEntity(this.currentId++, dto);
//     this.users.push(entity);
//     return UserMapper.toResponse(entity);
//   }

//   update(id: number, dto: UpdateUserDto) {
//     const user = this.users.find(u => u.id === id);
//     if (!user) return { error: 'User not found' };

//     user.name = dto.name;
//     user.email = dto.email;

//     return UserMapper.toResponse(user);
//   }

//   partialUpdate(id: number, dto: PartialUpdateUserDto) {
//     const user = this.users.find(u => u.id === id);
//     if (!user) return { error: 'User not found' };

//     if (dto.name !== undefined) user.name = dto.name;
//     if (dto.email !== undefined) user.email = dto.email;

//     return UserMapper.toResponse(user);
//   }

//   delete(id: number) {
//     const exists = this.users.some(u => u.id === id);
//     if (!exists) return { error: 'User not found' };

//     this.users = this.users.filter(u => u.id !== id);
//     return { message: 'Deleted successfully' };
//   }
// }

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user-dto';
import { PartialUpdateUserDto } from '../dtos/partial-update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  /**
   * Obtener todos los usuarios (enfoque funcional)
   */
  async findAll(): Promise<UserResponseDto[]> {
    // 1. Repository → Entities
    const entities = await this.userRepository.find();

    // 2. Entities → Domain Models → DTOs (programación funcional)
    return entities
      .map(User.fromEntity)           // Entity → User
      .map(user => user.toResponseDto()); // User → DTO
  }

  /**
   * Obtener un usuario por ID (enfoque funcional con manejo de errores)
   */
  async findOne(id: number): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return User.fromEntity(entity).toResponseDto();
  }

  /**
   * Crear usuario (flujo funcional)
   */
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    // Flujo funcional: DTO → Model → Entity → Save → Model → DTO
    const user = User.fromDto(dto);           // DTO → Domain
    const entity = user.toEntity();            // Domain → Entity
    const saved = await this.userRepository.save(entity); // Persistir

    if (await this.userRepository.exist({ where: { email: dto.email } })) {
      throw new BadRequestException("El email ya está registrado");
    }
    
    return User.fromEntity(saved).toResponseDto(); // Entity → Domain → DTO
  }

  /**
   * Actualizar usuario completo (PUT)
   */
  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Flujo funcional con transformaciones
    const updated = User.fromEntity(entity)  // Entity → Domain
      .update(dto)                           // Aplicar cambios
      .toEntity();                           // Domain → Entity

    const saved = await this.userRepository.save(updated);

    return User.fromEntity(saved).toResponseDto();
  }

  /**
   * Actualizar parcialmente (PATCH)
   */
  async partialUpdate(id: number, dto: PartialUpdateUserDto): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updated = User.fromEntity(entity)
      .partialUpdate(dto)
      .toEntity();

    const saved = await this.userRepository.save(updated);

    return User.fromEntity(saved).toResponseDto();
  }

  /**
   * Eliminar usuario
   */
  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}