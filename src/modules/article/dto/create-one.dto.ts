import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOneArticleDto {
  @ApiProperty({
    description: 'Article title',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Article description',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}

export class CreateOneArticlePayload extends CreateOneArticleDto {
  authorId: string;
}
