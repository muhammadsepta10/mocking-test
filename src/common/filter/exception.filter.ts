import { LoggerService } from '@common/logger/logger.service';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as moment from 'moment';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private logService: LoggerService,
  ) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const path = request['path'];
    const responseTime = moment.duration(
      new Date().getTime() - request['requestTime'] || 0,
    );
    const msRpns = responseTime.asMilliseconds();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const response: any = exception?.getResponse
      ? exception?.getResponse()
      : null;
    if (response && typeof response === 'object' && !response?.data?.message) {
      response.data = {};
      response.data.message = response.message;
    }
    const responseBody =
      exception instanceof HttpException && httpStatus < 500
        ? response
        : {
            statusCode: httpStatus,
            message: 'Internal server error!!',
            data: {
              timestamp: new Date().toISOString(),
              path: httpAdapter.getRequestUrl(ctx.getRequest()),
              message: 'Internal server error!!',
            },
          };
    if (httpStatus >= 500) {
      this.logService.error(`ERROR API ${request.method}-${exception.stack}`, {
        path,
        trace: exception.stack,
        reqBody: JSON.stringify(request?.body || {}),
        requestHeaders: JSON.stringify(request?.headers || {}),
        resBody: JSON.stringify(responseBody),
        methode: request.method,
        query: JSON.stringify(request.query),
        responseTime: msRpns,
        responseCode: 500,
        ip: (
          request.headers['x-forwarded-for'] || request.socket.remoteAddress
        )?.toString(),
        userAgent: request?.headers?.['user-agent'] || '',
        requestTime: request?.['requestTime'] || '',
        files: JSON.stringify(request?.files || request?.file || {}),
        context: 'ERROR',
      });
    }
    if (httpStatus < 500) {
      this.logService.warn(`WARN API ${request.method}-${response.message}`, {
        path,
        trace: response?.message,
        reqBody: JSON.stringify(request?.body || {}),
        requestHeaders: JSON.stringify(request?.headers || {}),
        resBody: JSON.stringify(responseBody),
        methode: request.method,
        query: JSON.stringify(request.query),
        responseTime: msRpns,
        responseCode: response.statusCode,
        ip: (
          request.headers['x-forwarded-for'] || request.socket.remoteAddress
        )?.toString(),
        userAgent: request?.headers?.['user-agent'] || '',
        requestTime: request?.['requestTime'] || '',
        files: JSON.stringify(request?.files || request?.file || {}),
        context: 'WARNING',
      });
    }
    // const responseTime = (new Date().getTime()) - request["requestTime"]
    // const requestId = request["requestId"]
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
