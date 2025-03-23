import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }
}
