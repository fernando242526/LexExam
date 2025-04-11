import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const userId = req.user?.id || 'anónimo';

    const now = Date.now();
    
    this.logger.log(
      `[${method}] ${url} - Usuario: ${userId} - IP: ${ip} - User Agent: ${userAgent}`,
    );
    
    if (Object.keys(body).length > 0) {
      this.logger.debug(`Cuerpo de la petición: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`[${method}] ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}