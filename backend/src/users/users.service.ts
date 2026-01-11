import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

/**
 * UsersService - содержит всю бизнес-логику для работы с пользователями
 *
 * @Injectable() - декоратор, позволяющий инжектировать этот сервис в другие классы
 */
@Injectable()
export class UsersService {
  /**
   * Конструктор - это специальный метод, который вызывается при создании экземпляра класса
   *
   * private readonly prisma: PrismaService - это Dependency Injection (внедрение зависимостей)
   * NestJS автоматически создаст экземпляр PrismaService и передаст его сюда
   *
   * private - делает поле доступным только внутри класса
   * readonly - поле нельзя изменить после инициализации
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создание нового пользователя
   *
   * @param createUserDto - объект с данными для создания пользователя (email, password, name)
   * @returns созданный пользователь без пароля
   *
   * async - функция асинхронная, будет возвращать Promise
   */
  async create(createUserDto: CreateUserDto) {
    try {
      // 1. Проверяем, существует ли пользователь с таким email
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      // Если пользователь с таким email уже есть - бросаем ошибку
      if (existingUser) {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      }

      // 2. Хэшируем пароль (преобразуем в зашифрованную строку)
      // bcrypt.hash() принимает: (пароль, количество раундов хеширования)
      // 10 раундов - это хороший баланс между безопасностью и скоростью
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // 3. Создаем пользователя в базе данных
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
        },
      });

      // 4. Удаляем пароль из ответа (для безопасности)
      // Используем деструктуризацию: берем password отдельно, всё остальное в userWithoutPassword
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      // 5. Возвращаем пользователя без пароля
      return userWithoutPassword;
    } catch (error) {
      // Если это наша ошибка ConflictException - пробрасываем её дальше
      if (error instanceof ConflictException) {
        throw error;
      }

      // Если произошла другая ошибка - логируем её и бросаем общую ошибку
      console.error('Ошибка при создании пользователя:', error);
      throw new InternalServerErrorException('Не удалось создать пользователя');
    }
  }

  /**
   * Получение всех пользователей
   *
   * @returns массив всех пользователей без паролей
   */
  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // password: false - не включаем пароль в ответ
      },
    });

    return users;
  }

  /**
   * Получение пользователя по ID
   *
   * @param id - ID пользователя
   * @returns пользователь без пароля или null, если не найден
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // password: false - не включаем пароль в ответ
      },
    });

    return user;
  }
}
