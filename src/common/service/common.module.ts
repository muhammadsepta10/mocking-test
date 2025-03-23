import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { AppConfigModule } from '@common/config/api/config.module';
import { DoplerConfigModule } from '@common/config/dopler/config.module';

@Module({
  imports: [AppConfigModule, DoplerConfigModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
