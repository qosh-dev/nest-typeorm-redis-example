import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindManyArticleDto {
  @ApiProperty({
    description: 'Records page',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Records limit per page',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Article ids(if specify other filters will be ignored)',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Expose()
  ids?: string[]

  @ApiProperty({
    description: 'Article title',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Article description',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Article createdAtGte',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  createdAtGte?: string;

  @ApiProperty({
    description: 'Article createdAtLte',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  createdAtLte?: string;

  @ApiProperty({
    description: 'Article name',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  authorUserName?: string;
}
