# Dischope

Приложение для управления задачами с планированием по дням, drag-and-drop интерфейсом и JWT-аутентификацией.

## Стек

| Слой | Технологии |
|------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript, Material UI, Zustand, dnd-kit |
| **Backend** | NestJS 11, TypeScript, Prisma ORM, JWT / Passport |
| **БД** | PostgreSQL 16 |
| **Инфраструктура** | Docker Compose |

Архитектура фронтенда — **Feature-Sliced Design**.

---

## Запуск через Docker Compose

Нужны Docker с плагином Compose и свободные порты **3000**, **3001** и **5432**. Все команды Compose ниже выполняются из корня репозитория.

### 1. Настроить окружение

```bash
cp .env.example .env
```

В `.env` замените `...` своими значениями:

| Переменная | Назначение |
|------------|------------|
| `POSTGRES_USER` | Пользователь PostgreSQL |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL |
| `POSTGRES_DB` | Название базы данных; по умолчанию `dischope` в шаблоне |
| `JWT_SECRET` | Случайный секрет для подписи JWT |
| `COMPOSE_FILE` | Путь к конфигурации: `docker/docker-compose.yml` |
| `FRONTEND_ORIGIN` | Адрес фронтенда для CORS: `http://localhost:3001` |
| `NEXT_PUBLIC_API_URL` | Адрес API для браузера: `http://localhost:3000` |

Для генерации пароля и JWT-секрета можно использовать соответственно `openssl rand -hex 24` и `openssl rand -hex 32`.

Текущая конфигурация Compose вставляет реквизиты PostgreSQL непосредственно в `DATABASE_URL`, без URL-кодирования. Для запуска используйте имя пользователя и название базы из латинских букв, цифр и `_`, а пароль — например, из шестнадцатеричных символов, как в команде выше. Пароль с `#`, `?` или другими зарезервированными символами требует доработки формирования URL. Кодировать сам `POSTGRES_PASSWORD` в `.env` не нужно: PostgreSQL должен получить исходный пароль.

`NEXT_PUBLIC_API_URL` используется браузером, поэтому здесь нужен доступный с компьютера адрес API. Значение встраивается во фронтенд при сборке; после его изменения образ фронтенда нужно пересобрать.

Файл `.env` исключён из Git; в репозитории хранится только `.env.example`.

### 2. Собрать и запустить сервисы

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f backend frontend
```

Compose запускает PostgreSQL, backend и frontend. Backend дожидается готовности PostgreSQL и перед запуском применяет миграции Prisma.

| Сервис | Адрес |
|--------|-------|
| Frontend | http://localhost:3001 |
| Backend | http://localhost:3000 |
| PostgreSQL | `localhost:5432` |

Данные PostgreSQL сохраняются в томе `postgres_data`. Переменные `POSTGRES_USER`, `POSTGRES_PASSWORD` и `POSTGRES_DB` инициализируют новую базу; изменение `.env` не меняет пользователя и пароль в уже существующей базе.

Остановить сервисы с сохранением данных:

```bash
docker compose down
```

## Запуск для разработки

Для запуска приложений вне контейнеров нужны Node.js (рекомендуется версия 22), pnpm и npm. PostgreSQL можно оставить в Docker.

### 1. Запустить базу данных

Сначала настройте корневой `.env`, как описано выше. Если весь стек уже запущен через Compose, остановите приложения, чтобы освободить порты:

```bash
docker compose stop backend frontend
docker compose up -d postgres
```

### 2. Запустить backend

Создайте `backend/.env`:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB?schema=public"
JWT_SECRET=replace_with_your_secret
FRONTEND_ORIGIN=http://localhost:3001
PORT=3000
```

Замените `USER`, `PASSWORD` и `DB` значениями из корневого `.env`, а `JWT_SECRET` — своим секретом. Если реквизиты содержат зарезервированные символы URL, закодируйте их в строке `DATABASE_URL`. Здесь используется хост `localhost`; имя `postgres` доступно внутри сети Compose.

Корневой `.env` используется Compose, а локально запущенный backend читает `backend/.env`.

```bash
cd backend
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm run start:dev
```

Сервер доступен на **http://localhost:3000**.

### 3. Запустить frontend

В другом терминале из корня репозитория:

```bash
cd frontend
npm ci
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
npm run dev -- --port 3001
```

Frontend доступен на **http://localhost:3001**.

---

## Полезные команды

```bash
# Prisma Studio — визуальный просмотр БД
cd backend && npx prisma studio

# Создать новую миграцию (из backend/)
pnpm exec prisma migrate dev --name <name>

# Сборка фронтенда
cd frontend && npm run build && npm start -- --port 3001

# Сборка бэкенда
cd backend && pnpm run build && pnpm run start:prod
```
