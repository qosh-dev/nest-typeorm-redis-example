import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import {
  RedisConnectionOptions,
  SchemaType,
  SchemaTypeConfs,
} from './config.type';

@Injectable()
export class ConfigService {
  private schema = {
    PORT: Joi.number().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRE: Joi.number().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PASSWORD: Joi.string(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
  };

  private confs: SchemaType<typeof this.schema>;

  constructor() {
    this.confs = this.validateAndExtractEnv(this.schema);
  }

  get port() {
    return this.confs.PORT;
  }

  get redisOptions(): RedisConnectionOptions {
    let url = `redis://:@${this.confs.REDIS_HOST}:${this.confs.REDIS_PORT}/1`;

    if (process.env.NODE_ENV === 'production') {
      url = `redis://:${this.confs.REDIS_PASSWORD}@${this.confs.REDIS_HOST}:${this.confs.REDIS_PORT}/1`;
    }

    return {
      url,
      host: this.confs.REDIS_HOST,
      port: this.confs.REDIS_PORT,
      passphrase: this.confs.REDIS_PASSWORD,
    };
  }

  get jwtConfig() {
    return {
      secret: this.confs.JWT_SECRET,
      expiresIn: this.confs.JWT_EXPIRE,
    };
  }

  // ------------------------------------------------------------------

  private validateAndExtractEnv<EnvT extends SchemaTypeConfs>(envSchema: EnvT) {
    const validationSchema = Joi.object(envSchema);
    const { error, value } = validationSchema.validate(process.env, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    const result = {} as SchemaType<EnvT>;

    for (const key in envSchema) {
      result[key as any] = value[key] as any;
    }

    return result;
  }
}
