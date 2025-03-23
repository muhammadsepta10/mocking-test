import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '@common/interceptor/transform.interceptor';
import {
  CreatePostPipe,
  PatchUpdatePostPipe,
  UpdatePostPipe,
} from './post.pipe';
import { CreatePostDTO, PatchUpdatePostDTO, UpdatePostDTO } from './post.dto';

@Controller('/api/post')
@ApiTags('post')
@UseInterceptors(TransformInterceptor)
export class PostController {
  constructor(private postService: PostService) {}
  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get('/:id')
  getPosts(@Param('id') id: number) {
    return this.postService.getPosts(id);
  }

  @Post()
  createPost(@Body(CreatePostPipe) data: CreatePostDTO) {
    return this.postService.createPost(data);
  }

  @Put(':id')
  updatePost(
    @Param('id') id: number,
    @Body(UpdatePostPipe) data: UpdatePostDTO,
  ) {
    return this.postService.updatePost(id, data);
  }

  @Patch(':id')
  patchPost(
    @Param('id') id: number,
    @Body(PatchUpdatePostPipe) data: PatchUpdatePostDTO,
  ) {
    return this.postService.patchPost(id, data);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(+id);
  }
}
