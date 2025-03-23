import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  exports: [TypeOrmModule, PostRepository],
  providers: [PostRepository],
})
export class PostDbModule {}
