import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

/**
 * TasksService - содержит всю бизнес-логику для работы с задачами
 *
 * @Injectable() - декоратор, позволяющий инжектировать этот сервис в другие классы
 */
@Injectable()
export class TasksService {
  /**
   * Конструктор - инжектим PrismaService для работы с базой данных
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создание новой задачи
   *
   * @param createTaskDto - объект с данными для создания задачи (title, userId, plannedAt)
   * @returns созданная задача
   */
  async create(createTaskDto: CreateTaskDto) {
    try {
      const task = await this.prisma.task.create({
        data: {
          title: createTaskDto.title,
          userId: createTaskDto.userId,
          plannedAt: createTaskDto.plannedAt
            ? new Date(createTaskDto.plannedAt)
            : null,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return task;
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      throw new InternalServerErrorException('Не удалось создать задачу');
    }
  }

  /**
   * Получение всех задач
   *
   * @returns массив всех задач
   */
  async findAll() {
    try {
      const tasks = await this.prisma.task.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return tasks;
    } catch (error) {
      console.error('Ошибка при получении задач:', error);
      throw new InternalServerErrorException('Не удалось получить задачи');
    }
  }

  /**
   * Получение всех задач конкретного пользователя
   *
   * @param userId - ID пользователя
   * @returns массив задач пользователя
   */
  async findByUserId(userId: string) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return tasks;
    } catch (error) {
      console.error('Ошибка при получении задач пользователя:', error);
      throw new InternalServerErrorException(
        'Не удалось получить задачи пользователя',
      );
    }
  }

  /**
   * Получение задачи по ID
   *
   * @param id - ID задачи
   * @returns задача
   */
  async findOne(id: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      if (!task) {
        throw new NotFoundException('Задача не найдена');
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Ошибка при получении задачи:', error);
      throw new InternalServerErrorException('Не удалось получить задачу');
    }
  }

  /**
   * Обновление задачи
   *
   * @param id - ID задачи
   * @param updateTaskDto - объект с данными для обновления
   * @returns обновленная задача
   */
  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      // Проверяем, существует ли задача
      await this.findOne(id);

      // Подготавливаем данные для обновления
      const data: Prisma.TaskUpdateInput = {};

      if (updateTaskDto.title !== undefined) {
        data.title = updateTaskDto.title;
      }

      if (updateTaskDto.completed !== undefined) {
        data.completed = updateTaskDto.completed;
        // Если задача выполнена, устанавливаем дату завершения
        if (updateTaskDto.completed) {
          data.completedAt = new Date();
        } else {
          data.completedAt = null;
        }
      }

      if (updateTaskDto.plannedAt !== undefined) {
        data.plannedAt = updateTaskDto.plannedAt
          ? new Date(updateTaskDto.plannedAt)
          : null;
      }

      const task = await this.prisma.task.update({
        where: { id },
        data,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Ошибка при обновлении задачи:', error);
      throw new InternalServerErrorException('Не удалось обновить задачу');
    }
  }

  /**
   * Удаление задачи
   *
   * @param id - ID задачи
   */
  async remove(id: string) {
    try {
      // Проверяем, существует ли задача
      await this.findOne(id);

      await this.prisma.task.delete({
        where: { id },
      });

      return { message: 'Задача успешно удалена' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Ошибка при удалении задачи:', error);
      throw new InternalServerErrorException('Не удалось удалить задачу');
    }
  }
}
