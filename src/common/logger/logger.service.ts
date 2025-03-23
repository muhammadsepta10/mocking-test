import { Inject, Logger } from '@nestjs/common';
import { MetaDTO } from '../dto';
import * as winston from 'winston';
import * as MongoDB from 'winston-mongodb';
import { DoplerConfigService } from '@common/config/dopler/config.service';
import { AppConfigService } from '@common/config/api/config.service';

export class LoggerService {
  private logger: winston.Logger;
  constructor(
    @Inject('DoplerConfigModule')
    private readonly DoplerConfigService: DoplerConfigService,
    private appConfigService: AppConfigService,
  ) {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new MongoDB.MongoDB({
          level: 'info',
          db: this.DoplerConfigService.LOG_DB_URL,
          collection: 'logs',
          format: winston.format.metadata(),
        }),
      ],
    });
  }

  info(message: string, meta: MetaDTO) {
    this.appConfigService.NODE_ENV != 'production'
      ? Logger.log(message, meta)
      : null;
    this.logger.info(message, meta);
  }

  error(message: string, meta: MetaDTO) {
    this.appConfigService.NODE_ENV != 'production'
      ? Logger.error(message, meta?.trace, meta)
      : null;
    this.logger.error(message, meta);
  }

  warn(message: string, meta: MetaDTO) {
    this.appConfigService.NODE_ENV != 'production'
      ? Logger.warn(message, meta)
      : null;
    this.logger.warn(message, meta);
  }
}
