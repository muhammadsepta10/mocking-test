import { LoggerService } from '@common/logger/logger.service';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import * as moment from 'moment';

export class LoggingInterceptor implements NestInterceptor {
  constructor(private logService: LoggerService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    let errObj = '';
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const path = request['path'];
        let responseTime = moment.duration(
          new Date().getTime() - request['requestTime'] || 0,
        );
        const msRpns = responseTime.asMilliseconds();
        try {
          errObj = JSON?.stringify(data) || '';
        } catch (error) {
          errObj = '201';
        }
        this.logService.info(`${request.method}-${path}`, {
          path: path,
          reqBody: JSON.stringify(request?.body || {}),
          requestHeaders: JSON.stringify(request?.headers || {}),
          resBody: JSON.stringify(data),
          methode: request.method,
          query: JSON.stringify(request.query),
          responseTime: msRpns,
          responseCode: response.statusCode,
          ip: (
            request.headers['x-forwarded-for'] || request.socket.remoteAddress
          )?.toString(),
          userAgent: request?.headers?.['user-agent'] || '',
          requestTime: request?.['requestTime'] || '',
          context: 'INFO',
          files: JSON.stringify(request?.files || request?.file || {}),
        });
        return data;
      }),
    );
  }
}
