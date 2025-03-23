import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './module/post/post.module';
import { RequestLogMiddleware } from '@common/middleware/log.middleware';
import { AppConfigModule } from '@common/config/api/config.module';
import { DoplerConfigModule } from '@common/config/dopler/config.module';
import { DoplerConfigService } from '@common/config/dopler/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LoggerModule } from '@common/logger/logger.module';
import { CacheModule } from './module/cache/cache.module';

@Module({
  imports: [
    PostModule,
    AppConfigModule,
    DoplerConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [DoplerConfigModule],
      inject: [DoplerConfigService],
      // Use useFactory, useClass, or useExisting
      // to configure the DataSourceOptions.
      useFactory: (config: DoplerConfigService) =>
        config.projectDbTypeORMConfig(),
      // dataSource receives the configured DataSourceOptions
      // and returns a Promise<DataSource>.
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    LoggerModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLogMiddleware).forRoutes('*');
  }
}
