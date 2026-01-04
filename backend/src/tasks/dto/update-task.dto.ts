import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

/**
 * UpdateTaskDto - объект для валидации данных при обновлении задачи
 *
 * Все поля необязательные, так как мы можем обновить только часть данных
 */
export class UpdateTaskDto {
  /**
   * Название задачи
   * Необязательное поле
   */
  @IsOptional()
  @IsString()
  title?: string;

  /**
   * Статус выполнения задачи
   * Необязательное поле
   */
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  /**
   * Дата планирования задачи
   * Необязательное поле
   */
  @IsOptional()
  @IsDateString()
  plannedAt?: string;
}
