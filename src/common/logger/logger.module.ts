import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { DoplerConfigModule } from '@common/config/dopler/config.module';
import { AppConfigModule } from '@common/config/api/config.module';

@Module({
  imports: [DoplerConfigModule, AppConfigModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
