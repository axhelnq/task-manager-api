import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReplaceTaskDto } from './dto/replace-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllTasksDto } from './dto/find-all-tasks-dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAllTasks(query: FindAllTasksDto, ownerId: string) {
    // Використовуємо DTO як тип
    const where: Prisma.TaskWhereInput = {
      ownerId, // Фільтруємо тільки tasks авторизованого користувача
    };

    if (query.isCompleted !== undefined) {
      where.isCompleted = query.isCompleted;
    }

    if (query.priority !== undefined) {
      where.priority = +query.priority;
    }

    if (query.tags && query.tags.length > 0) {
      // Тепер query.tags гарантовано є string[]
      where.tags = { hasSome: query.tags };
    }

    if (query.search && query.search.trim() !== '') {
      where.title = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    // Підготовка параметрів сортування
    const sortDirection = query.sortOrder || 'asc';
    let orderBy: Prisma.TaskOrderByWithRelationInput;

    if (query.sortBy) {
      const sortField = query.sortBy;

      // Створюємо об'єкт orderBy динамічно з явним перевіренням полів
      switch (sortField) {
        case 'id':
          orderBy = { id: sortDirection };
          break;
        case 'title':
          orderBy = { title: sortDirection };
          break;
        case 'description':
          orderBy = { description: sortDirection };
          break;
        case 'isCompleted':
          orderBy = { isCompleted: sortDirection };
          break;
        case 'priority':
          orderBy = { priority: sortDirection };
          break;
        case 'createdAt':
          orderBy = { createdAt: sortDirection };
          break;
        case 'updatedAt':
          orderBy = { updatedAt: sortDirection };
          break;
        default:
          orderBy = { createdAt: 'desc' };
      }
    } else {
      // Сортування за замовчуванням за датою створення (найновіші спочатку)
      orderBy = { createdAt: 'desc' };
    }

    return this.prisma.task.findMany({
      where,
      orderBy,
    });
  }

  async findTaskById(id: string, ownerId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    if (task.ownerId !== ownerId) {
      throw new BadRequestException(
        'Access denied: This task does not belong to you',
      );
    }

    return task;
  }

  async createTask(dto: CreateTaskDto, ownerId: string) {
    return await this.prisma.task.create({
      data: {
        title: dto.title,
        description: '',
        isCompleted: false,
        priority: 1,
        tags: [],
        ownerId,
      },
    });
  }

  async replaceTask(id: string, dto: ReplaceTaskDto, ownerId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new BadRequestException('Task not found');
    }

    if (task.ownerId !== ownerId) {
      throw new BadRequestException(
        'Access denied: This task does not belong to you',
      );
    }

    return await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        isCompleted: dto.isCompleted,
        priority: dto.priority,
        tags: dto.tags,
        ownerId,
      },
    });
  }

  async updateTaskFields(
    id: string,
    dto: Partial<UpdateTaskDto>,
    ownerId: string,
  ) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    if (task.ownerId !== ownerId) {
      throw new BadRequestException(
        'Access denied: This task does not belong to you',
      );
    }

    // Видаляємо undefined поля перед оновленням
    // ownerId завжди береться з JWT, не можна змінювати через body
    const updateData: Partial<UpdateTaskDto> & { ownerId: string } = {
      ownerId,
    };
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.isCompleted !== undefined) updateData.isCompleted = dto.isCompleted;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.tags !== undefined) updateData.tags = dto.tags;

    return await this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteTask(id: string, ownerId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    if (task.ownerId !== ownerId) {
      throw new BadRequestException(
        'Access denied: This task does not belong to you',
      );
    }

    await this.prisma.task.delete({ where: { id } });

    return true;
  }
}
