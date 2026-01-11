import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma.service';

/**
 * AuthModule - модуль авторизации
 * Содержит всю логику для JWT аутентификации
 */
@Module({
  imports: [
    // PassportModule - базовый модуль для работы с passport
    PassportModule,
    // JwtModule - модуль для работы с JWT токенами
    JwtModule.register({
      // Секретный ключ для подписи токенов
      // В продакшене это должно быть в переменных окружения!
      secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
      // Опции для токена
      signOptions: {
        expiresIn: '7d', // Токен действителен 7 дней
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [AuthService], // Экспортируем AuthService для использования в других модулях
})
export class AuthModule {}
