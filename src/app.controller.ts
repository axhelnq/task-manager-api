import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { API_CONFIG } from './config/api.config';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Root endpoint',
    description:
      'Returns welcome message with API information and available endpoints',
  })
  @ApiOkResponse({
    description: 'API welcome message with endpoints information',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: API_CONFIG.welcomeMessage,
        },
        version: { type: 'string', example: API_CONFIG.version },
        documentation: {
          type: 'string',
          example: API_CONFIG.documentationPath,
        },
        endpoints: {
          type: 'object',
          properties: {
            auth: { type: 'string', example: API_CONFIG.endpoints.auth },
            tasks: { type: 'string', example: API_CONFIG.endpoints.tasks },
            health: { type: 'string', example: API_CONFIG.endpoints.health },
            info: { type: 'string', example: API_CONFIG.endpoints.info },
          },
        },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  getHello() {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Check if the API is running and healthy',
  })
  @ApiOkResponse({
    description: 'API is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 12345 },
      },
    },
  })
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('info')
  @ApiOperation({
    summary: 'API information',
    description: 'Get information about the API version and environment',
  })
  @ApiOkResponse({
    description: 'API information',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: API_CONFIG.name },
        version: { type: 'string', example: API_CONFIG.version },
        environment: { type: 'string', example: 'development' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  getInfo() {
    return this.appService.getInfo();
  }
}
