import { ApiProperty } from '@nestjs/swagger';

export interface MetaDTO {
  context?: string;
  trace?: string;
  path: string;
  uniqueId?: string;
  refId?: string;
  query?: string;
  resBody?: any;
  reqBody?: any;
  requestHeaders?: any;
  requestTime?: number;
  responseTime?: number;
  ip?: string;
  responseCode?: number;
  methode?: string;
  userAgent?: string;
  files?: any;
}

export interface DoplerDTO {
  AUTH_SECRET: string;
  BASE_URL: string;
  CACHE_DB_URL: string;
  IP2LOCATION_SECRET: string;
  LOG_DB_URL: string;
  PROJECT_DB_URL: string;
  DEFAULT_REGISTER_ACCESS_ID: string;
  MOCK_API_URL: string;
}

export class PaginationDTO {
  @ApiProperty({ required: false })
  search: string;
  @ApiProperty({ required: false })
  status: number;
  @ApiProperty({ required: false })
  limit: number;
  @ApiProperty({ required: false })
  page: number;
  @ApiProperty({ required: false })
  startDate: string;
  @ApiProperty({ required: false })
  endDate: string;
}
