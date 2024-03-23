import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheProvider } from '../../helpers/cache/cache.provider';
import { ArticleEntity } from './article.entity';
import { CreateOneArticlePayload } from './dto/create-one.dto';
import { FindManyArticleDto } from './dto/find-many.dto';
import { FindOneArticleDto } from './dto/find-one.dto';
import { UpdateOnePayload } from './dto/update-one.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private repo: Repository<ArticleEntity>,
    readonly cacheProvider: CacheProvider,
  ) {}

  async create(payload: CreateOneArticlePayload) {
    try {
      let record = this.repo.create({
        title: payload.title,
        description: payload.description,
        authorId: payload.authorId,
      });
      record = await this.repo.save(record);
      return record;
    } catch (e) {
      return null;
    }
  }

  async findOneBy(payload: FindOneArticleDto) {
    if (!Object.keys(payload).length) {
      return null;
    }
    return this.repo.findOneBy(payload);
  }

  async findManyBy(payload: FindManyArticleDto) {
    let { page = 1, limit = 10, ...filterProps } = payload;
    const skip = (page - 1) * limit;
    const queryBuilder = this.repo.createQueryBuilder('article');

    if (filterProps.ids) {
      let ids = Array.isArray(filterProps.ids)
        ? filterProps.ids
        : [filterProps.ids];
      queryBuilder.andWhereInIds(ids);
    } else {
      for (let key in filterProps) {
        if (!filterProps[key]) continue;
        if (key === 'createdAtGte') {
          queryBuilder.andWhere('createdAt >= :createdAtGte', {
            createdAtGte: filterProps[key],
          });
        } else if (key === 'createdAtLte') {
          queryBuilder.andWhere('createdAt <= :createdAtLte', {
            createdAtLte: filterProps[key],
          });
        } else if (key === 'authorUserName') {
          queryBuilder
            .innerJoin('article.author', 'author')
            .andWhere('author.username = :authorUserName', {
              authorUserName: filterProps[key],
            });
        } else {
          queryBuilder.andWhere(`${key} = :${key}`, {
            [key]: filterProps[key],
          });
        }
      }
    }

    const articles = await queryBuilder.take(limit).skip(skip).getMany();
    return articles;
  }

  async updateOne(payload: UpdateOnePayload) {
    const { id, authorId, ...updateProps } = payload;
    if (!Object.keys(updateProps).length) {
      return false;
    }
    const recordExist = await this.repo.existsBy({
      id,
      authorId,
    });

    if (!recordExist) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      // return false
    }
    await this.repo.update({ id }, updateProps);
    await this.invalidateRecordCache(id);
    return true;
  }

  async deleteOne(articleId: string, authorId: string) {
    try {
      const recordExist = await this.repo.existsBy({
        id: articleId,
        authorId,
      });

      if (!recordExist) {
        return false;
      }

      await this.repo.delete({ id: articleId, authorId });
      await this.invalidateRecordCache(articleId);
      return true;
    } catch (e) {
      return false;
    }
  }

  private async invalidateRecordCache(id: string) {
    const cachedRecords =
      await this.cacheProvider.getManyWithKeys<ArticleEntity>('article');

    cachedRecords.forEach(async (value, key) => {
      const [_, kId] = key.split(':');
      if (kId === id) {
        await this.cacheProvider.deleteOne(key);
        return;
      }
      const filteredRecords = value.filter((record) => record.id === id);
      if (filteredRecords.length) {
        await this.cacheProvider.deleteOne(key);
      }
    });
  }
}
