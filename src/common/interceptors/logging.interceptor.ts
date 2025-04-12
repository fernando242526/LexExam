import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const userId = req.user?.id || 'anónimo';
    const body = req.body || {}; // Garantizar que body nunca sea null o undefined

    const now = Date.now();
    
    this.logger.log(
      `[${method}] ${url} - Usuario: ${userId} - IP: ${ip} - User Agent: ${userAgent}`,
    );
    
    // Verificar que body sea un objeto y no esté vacío antes de usar Object.keys
    if (body && typeof body === 'object' && Object.keys(body).length > 0) {
      this.logger.debug(`Cuerpo de la petición: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`[${method}] ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}