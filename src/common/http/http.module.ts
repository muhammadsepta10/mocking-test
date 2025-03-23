import { Module } from '@nestjs/common';
import { HttpService } from './http.service';
import { HttpModule as AxiosModule } from '@nestjs/axios';
import { LoggerModule } from '@common/logger/logger.module';

@Module({
  imports: [
    AxiosModule.register({
      timeout: 20000,
      maxRedirects: 5
    }),
    LoggerModule
  ],
  providers: [HttpService],
  exports: [HttpService]
})
export class HttpModule {}
