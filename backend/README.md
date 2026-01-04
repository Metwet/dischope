# Dischope Backend

REST API для приложения управления задачами Dischope, построенный на [NestJS](https://nestjs.com/).

## Описание

Backend приложение на NestJS с PostgreSQL базой данных и Prisma ORM.

### Основные модули:

- **Users** - управление пользователями
- **Tasks** - управление задачами (создание, получение, обновление, удаление)

### Технологии:

- NestJS - фреймворк для Node.js
- TypeScript - типизированный JavaScript
- Prisma - современная ORM для работы с БД
- PostgreSQL - реляционная база данных
- class-validator - валидация данных
- bcrypt - хеширование паролей

## Быстрый старт

### 1. Установка зависимостей

```bash
pnpm install
```

### 2. Запуск базы данных

```bash
cd ../docker
docker compose up -d
```

### 3. Применение миграций

```bash
npx prisma migrate dev
```

### 4. Запуск сервера

```bash
# development mode
pnpm run start

# watch mode (рекомендуется для разработки)
pnpm run start:dev

# production mode
pnpm run start:prod
```

Сервер запустится на http://localhost:3000

## Доступные API

### Users API
- `POST /users` - создать пользователя
- `GET /users` - получить всех пользователей
- `GET /users/:id` - получить пользователя по ID

### Tasks API
- `POST /tasks` - создать задачу
- `GET /tasks` - получить все задачи
- `GET /tasks?userId=:id` - получить задачи пользователя
- `GET /tasks/:id` - получить задачу по ID
- `PATCH /tasks/:id` - обновить задачу
- `DELETE /tasks/:id` - удалить задачу

## Документация

📚 Детальная документация находится в папке `help-info/`:

- [TASKS_QUICKSTART.md](./help-info/TASKS_QUICKSTART.md) - быстрый старт для работы с задачами
- [TASKS_API.md](./help-info/TASKS_API.md) - полное описание Tasks API
- [API_GUIDE.md](./help-info/API_GUIDE.md) - общее руководство по API
- [LOCAL_SETUP.md](./help-info/LOCAL_SETUP.md) - настройка окружения
- [Postman коллекции](./help-info/) - готовые запросы для тестирования

## Примеры использования

### Создать пользователя

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Иван Иванов"
  }'
```

### Создать задачу

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Выучить NestJS",
    "userId": "USER_ID_ЗДЕСЬ",
    "plannedAt": "2024-01-15T10:00:00Z"
  }'
```

### Получить все задачи

```bash
curl http://localhost:3000/tasks
```

## Структура проекта

```
backend/
├── src/
│   ├── users/           # Модуль пользователей
│   │   ├── dto/         # Data Transfer Objects
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── tasks/           # Модуль задач
│   │   ├── dto/
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   └── tasks.module.ts
│   ├── prisma.service.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma    # Схема базы данных
│   └── migrations/      # Миграции
├── help-info/           # Документация
└── package.json
```

## Команды для разработки

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov

# build
pnpm run build

# lint
pnpm run lint

# format
pnpm run format
```

## Prisma команды

```bash
# Открыть Prisma Studio (GUI для БД)
npx prisma studio

# Создать миграцию
npx prisma migrate dev --name migration_name

# Применить миграции
npx prisma migrate deploy

# Сгенерировать Prisma Client
npx prisma generate

# Сбросить БД (ОСТОРОЖНО!)
npx prisma migrate reset
```

## Переменные окружения

Создайте файл `.env` в корне backend/:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dischope"
PORT=3000
```

## Возможные проблемы

### База данных не запущена

```
Error: Can't reach database server
```

**Решение:** Запустите PostgreSQL через Docker Compose:
```bash
cd ../docker
docker-compose up -d
```

### Миграции не применены

```
Error: Table does not exist
```

**Решение:** Примените миграции:
```bash
npx prisma migrate dev
```

### Порт занят

```
Error: Port 3000 is already in use
```

**Решение:** Измените порт в `src/main.ts` или остановите процесс на порту 3000

## Ресурсы

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Следующие шаги

- [ ] Добавить JWT аутентификацию
- [ ] Добавить авторизацию (роли пользователей)
- [ ] Добавить пагинацию для списков
- [ ] Добавить фильтрацию и сортировку
- [ ] Добавить Swagger документацию
- [ ] Написать тесты
- [ ] Добавить логирование
- [ ] Настроить CI/CD
