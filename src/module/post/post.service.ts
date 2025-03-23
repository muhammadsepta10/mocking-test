import { DoplerConfigService } from '@common/config/dopler/config.service';
import { HttpService } from '@common/http/http.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosInstance } from 'axios';
import { PostRepository } from 'src/db/project-db/entity/post/post.repository';
import {
  CreatePostDTO,
  MockDataDTO,
  PatchUpdatePostDTO,
  UpdatePostDTO,
} from './post.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class PostService {
  private axios: AxiosInstance;
  constructor(
    private httpService: HttpService,
    private doplerConfiService: DoplerConfigService,
    private cacheService: CacheService,
  ) {
    this.axios = this.httpService.getInstance();
  }

  @InjectRepository(PostRepository) private postRepository: PostRepository;

  async getAllPosts() {
    const key = 'post';
    let response = await this.cacheService
      .get(key)
      .then((v) => {
        return !v ? [] : JSON.parse(v);
      })
      .catch(() => {
        return [];
      });
    if (response.length < 1) {
      response = await this.axios
        .get(this.doplerConfiService.MOCK_API_URL)
        .then((v) => v?.data)
        .catch(() => []);
      await this.cacheService.set(
        key,
        JSON.stringify(response),
        response?.length < 1 ? 0 : 86400,
      );
    }
    return response;
  }

  async getPosts(id: number) {
    const response = await this.axios.get(
      `${this.doplerConfiService.MOCK_API_URL}/${id}`,
    );
    return response.data;
  }

  async createPost(data: CreatePostDTO) {
    const response = await this.axios
      .post<MockDataDTO>(this.doplerConfiService.MOCK_API_URL, data)
      .then((v) => v?.data);
    console.log('response', response);
    return this.postRepository
      .createQueryBuilder()
      .insert()
      .values({ ...response })
      .execute()
      .then((v) => v.generatedMaps[0]);
  }

  async updatePost(id: number, data: UpdatePostDTO) {
    const response = await this.axios.put(
      `${this.doplerConfiService.MOCK_API_URL}/${id}`,
      data,
    );
    return this.postRepository
      .createQueryBuilder()
      .insert()
      .values(response.data)
      .execute();
  }

  async patchPost(id: number, data: PatchUpdatePostDTO) {
    const response = await this.axios.patch(
      `${this.doplerConfiService.MOCK_API_URL}/${id}`,
      data,
    );
    return response.data;
  }

  async deletePost(id: number) {
    await this.axios.delete(`${this.doplerConfiService.MOCK_API_URL}/${id}`);
    await this.postRepository.delete(id);
    return { deleted: true };
  }
}
