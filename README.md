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

## Запуск локально

### 1. База данных (PostgreSQL)

```bash
cd docker
docker compose up -d
```

PostgreSQL поднимается на порту **5432** (база `dischope`, пользователь `postgres`, пароль `password`).

---

### 2. Backend

```bash
cd backend
pnpm install

# Применить миграции Prisma
npx prisma migrate dev

# Запустить в режиме разработки (hot-reload)
pnpm run start:dev
```

Сервер доступен на **http://localhost:3000**.

---

### 3. Frontend

```bash
cd frontend
npm install

# Создать файл окружения
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local

# Запустить в режиме разработки
npm run dev
```

Next.js запустится на **http://localhost:3001** (порт 3000 уже занят бэкендом). fldoskodksodk.

---

## Полезные команды

```bash
# Prisma Studio — визуальный просмотр БД
cd backend && npx prisma studio

# Создать новую миграцию
npx prisma migrate dev --name <name>

# Сборка фронтенда
cd frontend && npm run build && npm start

# Сборка бэкенда
cd backend && pnpm run build && pnpm run start:prod
```
