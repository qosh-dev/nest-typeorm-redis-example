import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'Mesmer', description: 'Username' })
  @Expose()
  @IsNotEmpty()
  @IsString()
   username: string;

  @ApiProperty({ description: 'User password' })
  @Expose()
  @IsNotEmpty()
  @IsStrongPassword({"minLength": 8})
   password: string;
}
