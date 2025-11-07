export const API_CONFIG = {
  name: 'Task Manager API',
  title: 'Task Manager API',
  version: '1.0.0',
  description:
    'API documentation for Task Manager application. This API provides endpoints for user authentication and task management. All protected endpoints require JWT Bearer token authentication.',
  welcomeMessage: 'Welcome to Task Manager API',
  contact: {
    name: 'axhelnq',
    url: 'https://github.com/axhelnq',
    email: 'axhelnq@gmail.com',
  },
  license: {
    name: 'MIT',
    url: 'https://github.com',
  },
  basePath: '/api/v1',
  documentationPath: '/docs',
  endpoints: {
    auth: '/api/v1/auth',
    tasks: '/api/v1/tasks',
    health: '/api/v1/health',
    info: '/api/v1/info',
  },
} as const;
