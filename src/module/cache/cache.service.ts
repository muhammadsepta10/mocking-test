import { AppConfigService } from '@common/config/api/config.service';
import { DoplerConfigService } from '@common/config/dopler/config.service';
import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import * as zlib from 'zlib';

@Injectable()
export class CacheService {
  private readonly redisClient: Redis;
  constructor(
    @Inject('DoplerConfigModule')
    private readonly DoplerConfigService: DoplerConfigService,
    private appConfigService: AppConfigService,
  ) {
    this.redisClient = new Redis(this.DoplerConfigService.CACHE_DB_URL);
  }

  async get(cacheKey: string) {
    const data =
      (await this.appConfigService.NODE_ENV) === 'development'
        ? null
        : await this.redisClient.get(cacheKey);
    let decompress = null;
    if (data) {
      decompress = zlib.gunzipSync(Buffer.from(data, 'base64')).toString();
    }
    return decompress;
  }

  async set(cacheKey: string, data: string, expired?: number) {
    data = zlib.gzipSync(data).toString('base64');
    expired = expired || 14400;
    this.appConfigService.NODE_ENV === 'development'
      ? null
      : await this.redisClient.set(cacheKey, data, 'EX', expired);
  }
}
