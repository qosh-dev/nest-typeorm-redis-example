import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheProvider } from '../../helpers/cache/cache.provider';
import { UserEntity } from '../user/user.entity';
import { ArticleController } from './article.controller';
import { ArticleEntity } from './article.entity';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ArticleEntity])],
  providers: [ArticleService, CacheProvider],
  controllers: [ArticleController],
})
export class ArticleModule {}
