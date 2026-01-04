import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UserMapper } from '../mappers/user.mapper';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PartialUpdateUserDto } from '../dtos/partial-update-user.dto';
import { error } from 'console';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dtos/update-user-dto';

@Controller('users')
export class UsersController {

  constructor(private readonly service: UsersService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(Number(id), dto);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() dto: PartialUpdateUserDto) {
    return this.service.partialUpdate(Number(id), dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}
