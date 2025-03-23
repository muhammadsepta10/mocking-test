import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDTO {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  body: string;
}

export class UpdatePostDTO {
  @ApiProperty()
  title: string;
  @ApiProperty()
  body: string;
}

export class PatchUpdatePostDTO {
  @ApiProperty()
  title: string;
  @ApiProperty()
  body: string;
}

export class MockDataDTO {
  userId: number;
  title: string;
  body: string;
  id: number;
}
