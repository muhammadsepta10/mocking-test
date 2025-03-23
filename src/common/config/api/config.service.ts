import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get NODE_ENV(): string {
    return this.configService.get<string>('app.NODE_ENV') || 'development';
  }

  get APP_PORT(): string {
    return this.configService.get<string>('app.APP_PORT');
  }

  get DOPPLER(): string {
    return this.configService.get<string>('app.DOPPLER');
  }
}
