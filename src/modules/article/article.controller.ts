import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { CurrentUserModel } from '../auth/models/current-user.model';
import {
  ApiDeleteOneArticle,
  ApiGetManyArticle,
  ApiGetOneArticle,
  ApiPatchArticle,
  ApiPostCreateOneArticle,
} from './api.decorators';
import { ArticleService } from './article.service';
import { CreateOneArticleDto } from './dto/create-one.dto';
import { FindManyArticleDto } from './dto/find-many.dto';
import { FindOneArticleDto } from './dto/find-one.dto';
import { UpdateOneArticleDto } from './dto/update-one.dto';

@ApiTags('Articles')
@Controller('/article')
export class ArticleController {
  constructor(private service: ArticleService) {}

  @ApiPostCreateOneArticle()
  createArticle(
    @Body() body: CreateOneArticleDto,
    @CurrentUser() currentUser: CurrentUserModel,
  ) {
    return this.service.create({ ...body, authorId: currentUser.id });
  }

  @ApiGetOneArticle()
  async findOneArticle(@Query() query: FindOneArticleDto) {
    const record = await this.service.findOneBy(query);
    if (!record) {
      throw new NotFoundException('NOT_FOUND');
    }
    return record;
  }

  @ApiGetManyArticle()
  async findManyArticles(@Query() query: FindManyArticleDto) {
    return this.service.findManyBy(query);
  }

  @ApiPatchArticle()
  async updateOneArticle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateOneArticleDto,
    @CurrentUser() currentUser: CurrentUserModel,
  ) {
    return this.service.updateOne({
      ...body,
      id,
      authorId: currentUser.id,
    });
  }

  @ApiDeleteOneArticle()
  async deleteOneArticle(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserModel,
  ) {
    const status = await this.service.deleteOne(id, currentUser.id);
    return status;
  }
}
