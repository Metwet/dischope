import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

/**
 * AppModule - главный модуль приложения
 * 
 * Здесь мы импортируем все остальные модули нашего приложения
 * imports: [UsersModule] - подключаем модуль пользователей
 */
@Module({
  imports: [UsersModule], // Импортируем модуль пользователей
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
