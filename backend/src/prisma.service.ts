import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * PrismaService - это сервис для работы с базой данных через Prisma ORM
 *
 * @Injectable() - декоратор, который говорит NestJS, что этот класс можно инжектировать
 * OnModuleInit - интерфейс, который вызывается при инициализации модуля
 * OnModuleDestroy - интерфейс, который вызывается при уничтожении модуля
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  /**
   * onModuleInit вызывается автоматически, когда NestJS инициализирует модуль
   * Здесь мы подключаемся к базе данных
   */
  async onModuleInit() {
    await this.$connect();
    console.log('✅ База данных подключена');
  }

  /**
   * onModuleDestroy вызывается, когда приложение завершается
   * Здесь мы закрываем соединение с базой данных
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 База данных отключена');
  }
}
