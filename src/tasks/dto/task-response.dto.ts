import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({
    description: 'Task unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
  })
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Write comprehensive documentation for the API',
  })
  description: string;

  @ApiProperty({
    description: 'Task completion status',
    example: false,
  })
  isCompleted: boolean;

  @ApiProperty({
    description: 'Task priority (1 = low, 2 = medium, 3 = high)',
    example: 2,
    minimum: 1,
    maximum: 3,
  })
  priority: number;

  @ApiProperty({
    description: 'Array of task tags',
    example: ['work', 'urgent', 'backend'],
    type: [String],
  })
  tags: string[];

  @ApiProperty({
    description: 'Task owner ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  ownerId: string;

  @ApiProperty({
    description: 'Task creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Task last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
