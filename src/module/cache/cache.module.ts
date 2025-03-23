import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { DoplerConfigModule } from '@common/config/dopler/config.module';
import { AppConfigModule } from '@common/config/api/config.module';

@Module({
  providers: [CacheService],
  imports: [DoplerConfigModule, AppConfigModule],
  exports: [CacheService],
})
export class CacheModule {}
