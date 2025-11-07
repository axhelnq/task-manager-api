import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReplaceTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
    minLength: 2,
    maxLength: 50,
    required: true,
  })
  @IsDefined({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @Length(2, 50, { message: 'Title must be between 2 and 50 characters' })
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Write comprehensive documentation for the API',
    maxLength: 225,
    required: true,
  })
  @IsDefined({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(225, { message: 'Description must be less than 225 characters' })
  description: string;

  @ApiProperty({
    description: 'Task completion status',
    example: false,
    required: true,
  })
  @IsDefined({ message: 'isCompleted is required' })
  @IsNotEmpty({ message: 'isCompleted is required' })
  @IsBoolean({ message: 'isCompleted must be a boolean' })
  isCompleted: boolean;

  @ApiProperty({
    description: 'Task priority (1 = low, 2 = medium, 3 = high)',
    example: 2,
    minimum: 1,
    maximum: 3,
    required: true,
  })
  @IsDefined({ message: 'Priority is required' })
  @IsNotEmpty({ message: 'Priority is required' })
  @IsInt({ message: 'Priority must be an integer number' })
  @Min(1, { message: 'Priority must be greater than 0' })
  @Max(3, { message: 'Priority must be less than or equal to 3' })
  priority: number;

  @ApiProperty({
    description: 'Array of task tags',
    example: ['work', 'urgent', 'backend'],
    type: [String],
    maxItems: 20,
    required: true,
  })
  @IsDefined({ message: 'Tags is required' })
  @IsNotEmpty({ message: 'Tags is required' })
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @MaxLength(20, {
    each: true,
    message: 'Each tag must be less than 20 characters',
  })
  @ArrayMaxSize(20, { message: 'Tags must be less than or equal to 20' })
  tags: string[];
}
