import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

/**
 * CreateTaskDto - объект для валидации данных при создании задачи
 *
 * DTO (Data Transfer Object) - объект для передачи данных между слоями приложения
 *
 * Декораторы валидации:
 * @IsString() - значение должно быть строкой
 * @IsNotEmpty() — для обязательных полей (userId)
 * @IsOptional() - поле необязательное
 * @IsDateString() - значение должно быть строкой в формате даты ISO 8601
 */
export class CreateTaskDto {
  /**
   * Название задачи (может быть пустой строкой — например, быстрая вставка с дашборда)
   */
  @IsOptional()
  @IsString()
  title?: string;

  /**
   * ID пользователя, которому принадлежит задача
   * Обязательное поле, должно быть непустой строкой
   */
  @IsString()
  @IsNotEmpty()
  userId: string;

  /**
   * Дата планирования задачи
   * Необязательное поле, должно быть в формате ISO 8601 (например: 2024-01-15T10:00:00Z)
   */
  @IsOptional()
  @IsDateString()
  plannedAt?: string;
}
