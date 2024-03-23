import { Injectable } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class CacheProvider {
  private instance: Redis;

  private cacheDelaySec = 15;

  constructor(readonly configService: ConfigService) {
    const redisConfig: RedisOptions = {
      host: configService.redisOptions.host,
      // password: configService.redisOptions.passphrase,
      port: configService.redisOptions.port,
    };
    try {
      this.instance = new Redis(redisConfig);
    } catch (error) {
      throw error;
    }
  }

  async getOne<T = any>(key: string): Promise<T> {
    const [object] = await this.instance.lrange(key, 0, 1);
    if (object) {
      return JSON.parse(object);
    }
    return;
  }

  async create(key: string, object: any): Promise<void> {
    await this.instance.lpush(key, JSON.stringify(object));
    await this.instance.expire(key, this.cacheDelaySec);
  }

  async createMany<T = any>(
    namespace: string,
    objects: T[],
    identifierField: keyof T,
  ): Promise<void> {
    const pipeline = this.instance.pipeline();
    for (const object of objects) {
      const key = `${namespace}:${object[identifierField]}`;
      pipeline.lpush(key, JSON.stringify(object));
      pipeline.expire(key, this.cacheDelaySec);
    }
    await pipeline.exec();
  }

  async getMany<T = any>(namespace: string): Promise<T[]> {
    const keys = await this.instance.keys(`${namespace}:*`);
    const objects: any[] = [];
    for (const key of keys) {
      const records = await this.instance.lrange(key, 0, -1);
      const parced = records.map((v) => JSON.parse(v));
      objects.push(...parced);
    }
    return objects;
  }

  async getManyWithKeys<T = any>(namespace: string): Promise<Map<string, T[]>> {
    const keys = await this.instance.keys(`${namespace}:*`);
    const map = new Map<string, T[]>();
    for (const key of keys) {
      const records = await this.instance.lrange(key, 0, -1);
      const parced = records.map((v) => JSON.parse(v));
      map.set(key, parced);
    }
    return map;
  }

  async deleteOne(key: string): Promise<void> {
    await this.instance.del(key);
  }

  async drop(namespace: string): Promise<void> {
    const keys = await this.instance.keys(`${namespace}:*`);
    if (keys.length > 0) {
      await this.instance.del(keys);
    }
  }

  getKey(
    namespace: string,
    extra: { [n in string]: string | number | boolean },
  ): string {
    const keysExtra = Object.keys(extra).reduce((s, k) => s + extra[k], '');
    return `${namespace}:${keysExtra}`;
  }
}
