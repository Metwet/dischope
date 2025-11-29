import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO (Data Transfer Object) - это класс, который описывает структуру данных
 * для создания пользователя
 * 
 * Декораторы (@ символы) используются для валидации данных:
 * - @IsEmail() - проверяет, что это валидный email
 * - @IsNotEmpty() - поле не может быть пустым
 * - @IsString() - проверяет, что это строка
 * - @MinLength(6) - минимальная длина 6 символов
 * - @IsOptional() - поле необязательное
 */
export class CreateUserDto {
  /**
   * Email пользователя
   * Обязательное поле, должно быть валидным email
   */
  @IsEmail({}, { message: 'Введите корректный email адрес' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  /**
   * Пароль пользователя
   * Обязательное поле, минимум 6 символов
   */
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;

  /**
   * Имя пользователя
   * Необязательное поле
   */
  @IsString({ message: 'Имя должно быть строкой' })
  @IsOptional()
  name?: string;
}

