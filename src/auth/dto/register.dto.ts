import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegReq {
  @ApiProperty({
    description: 'Display name for account registration',
    example: 'John Smith',
    minLength: 3,
    maxLength: 50,
    required: true,
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  name: string;

  @ApiProperty({
    description: 'Email address for account registration',
    example: 'john.smith@example.com',
    format: 'email',
    required: true,
  })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    description: 'Password for account registration (min 6 characters)',
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
