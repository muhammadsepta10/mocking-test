import { Module } from '@nestjs/common';
import { DoplerConfigService } from './config.service';
import { AppConfigModule } from '../api/config.module';

@Module({
  imports: [AppConfigModule],
  providers: [
    DoplerConfigService,
    {
      provide: 'DoplerConfigModule',
      useFactory: async (configService: DoplerConfigService) => {
        // Tunggu sampai data diinisialisasi
        await configService.onModuleInit();
        return configService;
      },
      inject: [DoplerConfigService],
    },
  ],
  exports: [DoplerConfigService, 'DoplerConfigModule'],
})
export class DoplerConfigModule {}
