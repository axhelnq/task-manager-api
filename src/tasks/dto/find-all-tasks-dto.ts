import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  Min,
  IsIn,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// Функція-хелпер для перетворення рядка в масив
const transformTags = ({ value }: { value: string | string[] }): string[] => {
  if (Array.isArray(value)) {
    return value;
  }
  // Якщо теги прийшли як рядок "tag1,tag2,tag3"
  if (typeof value === 'string') {
    return value.split(',').map((tag) => tag.trim());
  }
  return [];
};

export class FindAllTasksDto {
  @ApiPropertyOptional({
    description: 'Filter tasks by completion status',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  // Трансформує рядок "true" в boolean true, і "false" в boolean false
  @Transform(({ value }) => value === 'true')
  isCompleted?: boolean;

  @ApiPropertyOptional({
    description: 'Filter tasks by priority (1 = low, 2 = medium, 3 = high)',
    example: 2,
    type: Number,
    minimum: 1,
    maximum: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  // Трансформує рядок "3" в число 3
  @Transform(({ value }) => Number(value))
  priority?: number;

  @ApiPropertyOptional({
    description:
      'Filter tasks by tags. Can be provided as array or comma-separated string',
    example: ['work', 'urgent'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  // Трансформує або рядок "tag1,tag2", або обробляє масив
  @Transform(transformTags)
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Search tasks by title (case-insensitive)',
    example: 'documentation',
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'createdAt',
    enum: [
      'id',
      'title',
      'description',
      'isCompleted',
      'priority',
      'createdAt',
      'updatedAt',
    ],
  })
  @IsOptional()
  @IsString()
  @IsIn([
    'id',
    'title',
    'description',
    'isCompleted',
    'priority',
    'createdAt',
    'updatedAt',
  ])
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  @Transform(({ value }: { value?: string }) =>
    value ? value.toLowerCase() : 'asc',
  )
  sortOrder?: 'asc' | 'desc';
}
