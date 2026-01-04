import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusModule } from './status/status.module';
import { AllExceptionsFilter } from './exceptions/filters/all-exceptions.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({

  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'ups',
      password: 'ups123',
      database: 'devdb-nest',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo
      logging: true,     // Muestra SQL en consola
    }),
    StatusModule,
    UsersModule,
    ProductsModule,
  ],
})
export class AppModule { }