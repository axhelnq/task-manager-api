# Task Manager API

<img src="https://img.shields.io/badge/Nest.js-%23E0234E.svg?logo=nestjs&logoColor=white" height="40" alt="nestjs logo"  />
<img width="12" />
<img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" height="40" alt="prisma logo"  />
<img width="12" />
<img src="https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white" height="40" alt="postgresql logo"  />
<img width="12" />
<img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff" height="40" alt="docker logo"  />
<img width="12" />
<img src="https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff" height="40" alt="byn logo"  />

RESTful API for task management with user authentication, built with NestJS.

## 🚀 Technologies

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Typed JavaScript
- **Prisma** - Modern ORM for database operations
- **PostgreSQL** - Relational database
- **JWT** - Authentication using JSON Web Tokens
- **Argon2** - Password hashing
- **Swagger** - API documentation
- **Passport** - Authentication strategies

## 📋 Features

### Authentication

- User registration
- User login
- Access token refresh via refresh token
- User logout
- Get current user information

### Task Management

- Create tasks
- Get task list with filtering, search, and sorting
- Get task by ID
- Update task (partial and full)
- Delete task

## 🛠 Installation

### Requirements

- Node.js (version 18+ recommended)
- PostgreSQL 12+
- Bun or npm/yarn

### Installation Steps

1. Clone the repository:

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:

```bash
bun install
# or
npm install
# or
yarn install
```

3. Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/database_name?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_ACCESS_TOKEN_TTL="15m"
JWT_REFRESH_TOKEN_TTL="7d"

# Cookie Configuration
COOKIE_DOMAIN="localhost"

# Server Configuration
PORT=1488
NODE_ENV=development
```

4. Set up the database:

```bash
# Apply migrations
bunx prisma migrate dev
# or
npx prisma migrate dev
# or
yarn prisma migrate dev

# Generate Prisma Client
bunx prisma generate
# or
npx prisma generate
# or
yarn prisma generate
```

5. Run the application:

```bash
# Development mode
bun run start:dev
# or
npm run start:dev
# or
yarn start:dev

# Production mode
bun run build
bun run start:prod
# or
npm run build
npm run start:prod
# or
yarn build
yarn start:prod
```

## 📚 API Documentation

After starting the application, Swagger documentation is available at:

```
http://localhost:1488/docs
```

## 🔐 Authentication

The API uses JWT tokens for authentication. After successful registration or login, tokens are stored in HTTP-only cookies.

### Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login to the system
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout from the system
- `GET /api/auth/@me` - Get current user information (requires authentication)

### Using Protected Endpoints

To access protected endpoints (e.g., `/api/tasks`), you need to:

1. Login to the system via `/api/auth/login`
2. The token will be automatically saved in cookies
3. On subsequent requests, the token will be automatically sent

Alternatively, you can use a Bearer token in the header:

```
Authorization: Bearer <your-access-token>
```

## 📝 Task Management

### Endpoints

- `GET /api/tasks` - Get all tasks (with filtering, search, and sorting)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Fully replace a task
- `PATCH /api/tasks/:id` - Partially update a task
- `DELETE /api/tasks/:id` - Delete a task

All task endpoints require authentication.

### Filtering and Search

When getting a list of tasks, the following query parameters are available:

- `isCompleted` - Filter by completion status (boolean)
- `priority` - Filter by priority (number)
- `tags` - Filter by tags (string[])
- `search` - Search by title (string)
- `sortBy` - Field for sorting
- `sortOrder` - Sort order (asc/desc)

## 🗄 Database

The project uses Prisma for database operations. The database schema is defined in `prisma/schema.prisma`.

### Models

**User**

- `id` - UUID
- `email` - Unique email
- `password` - Hashed password
- `name` - User name
- `createdAt` - Creation date
- `updatedAt` - Update date
- `tasks` - Related tasks

**Task**

- `id` - UUID
- `title` - Task title
- `description` - Task description
- `isCompleted` - Completion status
- `priority` - Priority
- `tags` - Array of tags
- `createdAt` - Creation date
- `updatedAt` - Update date
- `ownerId` - Task owner ID

### Migrations

```bash
# Create a new migration
bunx prisma migrate dev --name migration_name

# Apply migrations in production
bunx prisma migrate deploy

# Rollback migration
bunx prisma migrate reset
```

### Prisma Studio

For visual viewing and editing of data:

```bash
bunx prisma studio
```

## 📦 Scripts

- `build` - Build the project
- `start` - Start the application
- `start:dev` - Start in development mode with hot-reload
- `start:debug` - Start in debug mode
- `start:prod` - Start production version
- `lint` - Lint the code
- `format` - Format the code
- `test` - Run tests
- `test:watch` - Run tests in watch mode
- `test:cov` - Run tests with coverage
- `test:e2e` - Run E2E tests

## 🐳 Docker

The project includes a Dockerfile for PostgreSQL. To run the database:

```bash
docker build -t postgres-db .
docker run -d -p 5432:5432 postgres-db
```

## 📁 Project Structure

```
src/
├── auth/              # Authentication module
│   ├── decorators/    # Authorization decorators
│   ├── dto/           # Data Transfer Objects
│   ├── guards/        # Route protection guards
│   ├── interfaces/    # Interfaces
│   └── stategies/     # Passport strategies
├── tasks/             # Task module
│   └── dto/           # Task DTOs
├── common/            # Common components
│   ├── dto/           # Common DTOs
│   └── middlewares/   # Middleware
├── config/            # Configuration
├── prisma/            # Prisma service
└── utils/             # Utilities
```

## 🔒 Security

- Passwords are hashed using Argon2
- JWT tokens are stored in HTTP-only cookies
- Input validation via class-validator
- SQL injection protection via Prisma
- CORS configured for production

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**axhelnq**

- GitHub: [@axhelnq](https://github.com/axhelnq)
- Email: axhelnq@gmail.com

---

For more information, see the [NestJS documentation](https://docs.nestjs.com/).
