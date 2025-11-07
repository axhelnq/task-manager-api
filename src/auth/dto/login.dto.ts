import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginReq {
  @ApiProperty({
    description: 'Email address for account login',
    example: 'john.smith@example.com',
    format: 'email',
    required: true,
  })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    description: 'Password for account login (min 6 characters)',
    example: 'password123',
    minLength: 6,
    maxLength: 128,
    required: true,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 128, { message: 'Password must be between 6 and 32 characters' })
  password: string;
}
