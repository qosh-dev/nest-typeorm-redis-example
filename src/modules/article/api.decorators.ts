import {
  applyDecorators,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ApiResponseModel, ApiResponseStatus } from '../../helpers/api.helper';
import { CacheInterceptor } from '../../helpers/cache/cache.interceptor';
import { Authorized } from '../auth/decorator/authorized.decorator';
import { ArticleResponse } from './dto/article.response';
import { CreateOneArticleDto } from './dto/create-one.dto';
import { UpdateOneArticleDto } from './dto/update-one.dto';

export const ApiPostCreateOneArticle = () =>
  applyDecorators(
    ApiResponseModel(HttpStatus.OK, 'Will return new article', ArticleResponse),
    ApiResponseStatus(HttpStatus.BAD_REQUEST, 'INVALID_PAYLOAD'),
    ApiBody({ type: CreateOneArticleDto, required: true }),
    Authorized(),
    Post('/'),
  );

export const ApiGetOneArticle = () =>
  applyDecorators(
    ApiResponseModel(HttpStatus.OK, 'Will return article', ArticleResponse),
    ApiResponseStatus(HttpStatus.NOT_FOUND, 'NOT_FOUND'),
    UseInterceptors(CacheInterceptor("article", "query")),
    Get('/'),
  );

export const ApiGetManyArticle = () =>
  applyDecorators(
    ApiResponseModel(HttpStatus.OK, 'Will return many articles', [
      ArticleResponse,
    ]),
    ApiConsumes('multipart/form-data', 'application/json'),
    UseInterceptors(CacheInterceptor("article", "query")),
    Get('/many'),
  );

export const ApiPatchArticle = () =>
  applyDecorators(
    ApiResponseModel(
      HttpStatus.OK,
      'Will return article update status',
      Boolean,
    ),
    ApiResponseStatus(HttpStatus.NOT_FOUND, 'NOT_FOUND'),
    ApiConsumes('application/json'),
    ApiBody({ type: UpdateOneArticleDto, required: true }),
    Authorized(),
    Patch('/:id'),
  );

export const ApiDeleteOneArticle = () =>
  applyDecorators(
    ApiResponseModel(
      HttpStatus.OK,
      'Will return article delete status',
      Boolean,
    ),
    ApiConsumes('application/json'),
    Authorized(),
    Delete('/:id'),
  );
