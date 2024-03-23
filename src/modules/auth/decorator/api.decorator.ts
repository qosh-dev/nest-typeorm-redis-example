import { Get, HttpStatus, Post, applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import {
  ApiResponseModel,
  ApiResponseStatus,
} from '../../../helpers/api.helper';
import { AuthError } from '../auth.common';
import { CurrentUserModel } from '../models/current-user.model';
import { SignInDto } from '../models/dto/sign-in.dto';
import { SignUpDto } from '../models/dto/sign-up.dto';
import { TokenResponse } from '../models/dto/token.response';
import { Authorized } from './authorized.decorator';

export const ApiPostSignUp = () =>
  applyDecorators(
    ApiResponseModel(
      HttpStatus.CREATED,
      'Will return access token',
      TokenResponse,
    ),
    ApiResponseStatus(HttpStatus.BAD_REQUEST, AuthError.INVALID_PAYLOAD),
    ApiBody({ type: SignUpDto, required: true }),
    Post('/signup'),
  );

export const ApiPostSignIn = () =>
  applyDecorators(
    ApiResponseModel(
      HttpStatus.OK,
      'Will return access token',
      TokenResponse,
    ),
    ApiResponseStatus(HttpStatus.BAD_REQUEST, 'AuthError'),
    ApiResponseStatus(HttpStatus.CONFLICT, 'User already exist'),
    ApiResponseStatus(HttpStatus.UNAUTHORIZED, AuthError.NOT_AUTHORIZED),
    ApiBody({ type: SignInDto, required: true }),
    Post('/signin'),
  );

export const ApiGetProfile = () =>
  applyDecorators(
    ApiResponseModel(
      HttpStatus.OK,
      'Will return public user data',
      CurrentUserModel,
    ),
    Authorized(),
    Get('profile'),
  );
