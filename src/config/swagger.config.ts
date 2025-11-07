import { DocumentBuilder } from '@nestjs/swagger';
import { API_CONFIG } from './api.config';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle(API_CONFIG.title)
    .setDescription(API_CONFIG.description)
    .setVersion(API_CONFIG.version)
    .setContact(
      API_CONFIG.contact.name,
      API_CONFIG.contact.url,
      API_CONFIG.contact.email,
    )
    .setLicense(API_CONFIG.license.name, API_CONFIG.license.url)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addServer(API_CONFIG.basePath, 'API Server')
    .build();
}
