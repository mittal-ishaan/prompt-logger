import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    this.logger.error(
      `Error in request: [${request.method}]${request.url} with message: ${error.message}`,
    );

    let message, status, code;
    if (error instanceof HttpException) {
      message = error.message;
      status = error.getStatus();
      code = error.getStatus();
    } else {
      message = 'Internal server error';
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      code: code,
    });
  }
}
