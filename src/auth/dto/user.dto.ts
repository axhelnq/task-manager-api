import { ApiProperty } from '@nestjs/swagger';

export class UserRes {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.smith@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User display name',
    example: 'John Smith',
  })
  name: string;

  @ApiProperty({
    description: 'User account creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User account last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
