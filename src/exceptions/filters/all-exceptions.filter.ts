import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let details: Record<string, string> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp: any = exceptionResponse;

        if (Array.isArray(resp.message)) {
          message = 'Datos de entrada inválidos';
          details = this.extractValidationErrors(resp.message);
        } else {
          message = resp.message || exception.message;
        }
      } else {
        message = exception.message;
      }

    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
    }

    const errorResponse: ErrorResponse = {
      timestamp: new Date().toISOString(),
      status,
      error: HttpStatus[status] || 'Internal Server Error',
      message,
      path: request.url,
      ...(details && { details }),
    };

    response.status(status).json(errorResponse);
  }

  private extractValidationErrors(messages: any): Record<string, string> {
    const errors: Record<string, string> = {};

    if (Array.isArray(messages)) {
      messages.forEach((msg) => {
        if (typeof msg === 'object' && msg.property && msg.constraints) {
          const firstConstraint = Object.values(msg.constraints)[0];
          errors[msg.property] = firstConstraint as string;
        } else if (typeof msg === 'string') {
          const parts = msg.split(' ');
          errors[parts[0]] = msg;
        }
      });
    }

    return errors;
  }
}