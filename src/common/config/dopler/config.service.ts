import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import DopplerSDK from '@dopplerhq/node-sdk';
import { config } from 'dotenv';
import { AppConfigService } from '../api/config.service';
import { DoplerDTO } from '@common/dto';
config();

@Injectable()
export class DoplerConfigService implements OnModuleInit {
  private doppler: DoplerDTO;
  constructor(private appConfigService: AppConfigService) {}

  async onModuleInit() {
    await this._getAll();
  }

  private async _getAll() {
    const doppler = new DopplerSDK({
      accessToken:
        this.appConfigService.DOPPLER_TOKEN || process.env.DOPPLER_TOKEN,
    });
    const res = (await doppler.secrets.download('url-short', 'dev_moch', {
      format: 'json',
    })) as DoplerDTO;
    this.doppler = res;
  }

  get BASE_URL() {
    return this.doppler.BASE_URL;
  }

  get PROJECT_DB_URL() {
    return this.doppler.PROJECT_DB_URL;
  }

  get MOCK_API_URL() {
    return this.doppler.MOCK_API_URL;
  }

  get LOG_DB_URL() {
    return this.doppler.LOG_DB_URL;
  }

  get CACHE_DB_URL() {
    return this.doppler.CACHE_DB_URL;
  }

  async projectDbTypeORMConfig(): Promise<DataSourceOptions> {
    if (!this.doppler) {
      await this._getAll();
    }
    return {
      type: 'postgres',
      url: this.PROJECT_DB_URL,
      ssl: true,
      synchronize: true,
      logging: true,
      entities: [
        join(__dirname + '/../../../db/project-db/entity/**/*.entity.{ts,js}'),
      ],
      migrations: [
        join(__dirname + '/../../../db/project-db/migrations/*.{ts,js}'),
      ],
      extra: {
        timezone: 'Asia/Jakarta',
      },
    };
  }

  async projectDbConnection() {
    const appDataSource = new DataSource(await this.projectDbTypeORMConfig());
    await appDataSource.initialize();
    return appDataSource;
  }
}
