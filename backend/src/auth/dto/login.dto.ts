import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * LoginDto - DTO (Data Transfer Object) для валидации данных логина
 */
export class LoginDto {
  /**
   * Email пользователя
   * - Должен быть валидным email
   * - Обязательное поле
   */
  @IsEmail({}, { message: 'Некорректный email адрес' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  /**
   * Пароль пользователя
   * - Минимум 6 символов
   * - Обязательное поле
   */
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
  password: string;
}
