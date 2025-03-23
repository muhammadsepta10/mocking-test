import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
  constructor() {}
  async use(req: Request, res: any, next: (error?: any) => void) {
    const requestTime = new Date().getTime();
    req['requestTime'] = requestTime;
    next();
  }
}
