import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class ArticleResponse {
  @ApiProperty({
    example: 'b0beabbd-a32b-407d-a9ee-0f6cd2d1a4ab',
    description: 'Article id',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'Article title',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Article description',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  description: string;


  @ApiProperty({
    description: 'Article createdAt',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  createdAt: string

  @ApiProperty({
    example: 'b0beabbd-a32b-407d-a9ee-0f6cd2d1a4ab',
    description: 'Article authorId',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  authorId: string;
}
