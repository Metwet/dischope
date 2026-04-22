import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';
import {
  getSprintDateRange,
  getSprintYearForDate,
  getSprintsForYear,
} from './utils/sprint.utils';

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

  private getDayStart(date: string): Date {
    return new Date(`${date}T00:00:00.000Z`);
  }

  private getDayRange(date: Date): { start: Date; end: Date } {
    const start = this.getDayStart(date.toISOString().slice(0, 10));
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    return { start, end };
  }

  private buildWhereInput(
    filters: FindTasksQueryDto = {},
  ): Prisma.TaskWhereInput {
    const { userId, sprintNumber, sprintYear } = filters;

    if (
      (sprintYear !== undefined && sprintNumber === undefined) ||
      (sprintYear === undefined && sprintNumber !== undefined)
    ) {
      throw new BadRequestException(
        'Для фильтрации по спринту нужно передать и sprintYear, и sprintNumber',
      );
    }

    const where: Prisma.TaskWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (sprintYear !== undefined && sprintNumber !== undefined) {
      let startInclusive: Date;
      let endExclusive: Date;

      try {
        ({ startInclusive, endExclusive } = getSprintDateRange(
          sprintYear,
          sprintNumber,
        ));
      } catch (error) {
        if (error instanceof RangeError) {
          throw new BadRequestException(
            'Некорректный номер спринта для выбранного года',
          );
        }

        throw error;
      }

      where.OR = [
        {
          plannedAt: {
            gte: startInclusive,
            lt: endExclusive,
          },
        },
        {
          plannedAt: null,
          createdAt: {
            gte: startInclusive,
            lt: endExclusive,
          },
        },
      ];
    }

    return where;
  }

  /**
   * Создание новой задачи
   *
   * @param createTaskDto - объект с данными для создания задачи (title, userId, plannedAt)
   * @returns созданная задача
   */
  async create(createTaskDto: CreateTaskDto) {
    try {
      const plannedAt = createTaskDto.plannedAt
        ? new Date(createTaskDto.plannedAt)
        : null;
      const sortOrder = plannedAt
        ? await this.prisma.task.count({
            where: {
              userId: createTaskDto.userId,
              plannedAt: {
                gte: this.getDayRange(plannedAt).start,
                lt: this.getDayRange(plannedAt).end,
              },
            },
          })
        : 0;
      const task = await this.prisma.task.create({
        data: {
          title: createTaskDto.title,
          userId: createTaskDto.userId,
          plannedAt,
          sortOrder,
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
  async findAll(filters: FindTasksQueryDto = {}) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: this.buildWhereInput(filters),
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: [
          { plannedAt: 'asc' },
          { sortOrder: 'asc' },
          { createdAt: 'asc' },
        ],
      });

      return tasks;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

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
    return this.findAll({ userId });
  }

  getSprints(year: number) {
    return getSprintsForYear(year);
  }

  async getSprintYears(userId?: string) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: userId
          ? {
              userId,
            }
          : undefined,
        select: {
          plannedAt: true,
          createdAt: true,
        },
      });

      return [
        ...new Set(
          tasks.map((task) =>
            getSprintYearForDate(task.plannedAt ?? task.createdAt),
          ),
        ),
      ].sort((left, right) => left - right);
    } catch (error) {
      console.error('Ошибка при получении годов спринтов:', error);
      throw new InternalServerErrorException(
        'Не удалось получить доступные годы спринтов',
      );
    }
  }

  async reorder(reorderTasksDto: ReorderTasksDto) {
    const uniqueTaskIds = [
      ...new Set(reorderTasksDto.days.flatMap((day) => day.taskIds)),
    ];

    if (!uniqueTaskIds.length) {
      throw new BadRequestException(
        'Нужно передать хотя бы одну задачу для сортировки',
      );
    }

    if (
      uniqueTaskIds.length !==
      reorderTasksDto.days.flatMap((day) => day.taskIds).length
    ) {
      throw new BadRequestException(
        'Одна и та же задача не может встречаться несколько раз',
      );
    }

    try {
      const existingTasks = await this.prisma.task.findMany({
        where: {
          id: {
            in: uniqueTaskIds,
          },
        },
        select: {
          id: true,
        },
      });

      if (existingTasks.length !== uniqueTaskIds.length) {
        throw new BadRequestException('Некоторые задачи не найдены');
      }

      await this.prisma.$transaction(
        reorderTasksDto.days.flatMap(({ day, taskIds }) =>
          taskIds.map((taskId, index) =>
            this.prisma.task.update({
              where: { id: taskId },
              data: {
                plannedAt: this.getDayStart(day),
                sortOrder: index,
              },
            }),
          ),
        ),
      );

      const updatedTasks = await this.prisma.task.findMany({
        where: {
          id: {
            in: uniqueTaskIds,
          },
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

      return updatedTasks;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Ошибка при сохранении порядка задач:', error);
      throw new InternalServerErrorException(
        'Не удалось сохранить порядок задач',
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

      if (updateTaskDto.sortOrder !== undefined) {
        data.sortOrder = updateTaskDto.sortOrder;
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
