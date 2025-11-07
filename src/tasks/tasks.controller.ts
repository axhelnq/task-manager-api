import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReplaceTaskDto } from './dto/replace-task.dto';
import { FindAllTasksDto } from './dto/find-all-tasks-dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { Authorized } from '../auth/decorators/authirized.decorator';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tasks',
    description:
      'Retrieve all tasks for the authenticated user with optional filtering, searching, and sorting. Supports filtering by completion status, priority, tags, and searching by title.',
  })
  @ApiOkResponse({
    description: 'List of tasks retrieved successfully',
    type: [TaskResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @Authorization()
  findAllTasks(
    @Query()
    query: FindAllTasksDto,
    @Authorized('id') userId: string,
  ) {
    return this.taskService.findAllTasks(query, userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get task by ID',
    description:
      'Retrieve a specific task by its ID. Only tasks belonging to the authenticated user can be accessed.',
  })
  @ApiParam({
    name: 'id',
    description: 'Task unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Task retrieved successfully',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Task not found or access denied',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @Authorization()
  findTaskById(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.taskService.findTaskById(id, userId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description:
      'Create a new task with the provided title. The task will be assigned to the authenticated user.',
  })
  @ApiOkResponse({
    description: 'Task created successfully',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @Authorization()
  createTask(@Body() dto: CreateTaskDto, @Authorized('id') userId: string) {
    return this.taskService.createTask(dto, userId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Replace task (full update)',
    description:
      'Replace all fields of an existing task. All fields are required. Only tasks belonging to the authenticated user can be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Task unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Task replaced successfully',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Task not found, access denied, or invalid input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @Authorization()
  replaceTask(
    @Param('id') id: string,
    @Body() dto: ReplaceTaskDto,
    @Authorized('id') userId: string,
  ) {
    return this.taskService.replaceTask(id, dto, userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update task fields (partial update)',
    description:
      'Partially update task fields. Only provided fields will be updated. Only tasks belonging to the authenticated user can be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Task unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Task not found, access denied, or invalid input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @Authorization()
  updateTaskFields(
    @Param('id') id: string,
    @Body() dto: Partial<UpdateTaskDto>,
    @Authorized('id') userId: string,
  ) {
    return this.taskService.updateTaskFields(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete task',
    description:
      'Delete a task by its ID. Only tasks belonging to the authenticated user can be deleted.',
  })
  @ApiParam({
    name: 'id',
    description: 'Task unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Task deleted successfully',
    schema: {
      type: 'boolean',
      example: true,
    },
  })
  @ApiBadRequestResponse({
    description: 'Task not found or access denied',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @Authorization()
  deleteTask(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.taskService.deleteTask(id, userId);
  }
}
