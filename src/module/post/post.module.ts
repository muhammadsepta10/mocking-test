import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { HttpModule } from '@common/http/http.module';
import { DoplerConfigModule } from '@common/config/dopler/config.module';
import { PostDbModule } from 'src/db/project-db/entity/post/post.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  providers: [PostService],
  controllers: [PostController],
  imports: [HttpModule, DoplerConfigModule, PostDbModule, CacheModule],
})
export class PostModule {}
