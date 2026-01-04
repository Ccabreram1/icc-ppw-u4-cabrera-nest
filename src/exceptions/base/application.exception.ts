import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class ApplicationException extends HttpException {
  constructor(
    message: string,
    name: string,
    status: HttpStatus,
  ) {
    super(message, status);
    this.name = name;
  }
}