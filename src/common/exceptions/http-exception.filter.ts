import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | null;
  error: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    
    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || null,
      error: exception.name || 'HttpException',
    };
    
    const exceptionResponse = exception.getResponse();
    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const exceptionObj = exceptionResponse as Record<string, any>;
      if (exceptionObj.message) {
        errorResponse.message = 
          Array.isArray(exceptionObj.message) 
            ? exceptionObj.message[0] 
            : exceptionObj.message;
      }
      if (exceptionObj.error) {
        errorResponse.error = exceptionObj.error;
      }
    }
    
    response.status(status).json(errorResponse);
  }
}