import { Injectable } from '@nestjs/common';
import { API_CONFIG } from './config/api.config';

@Injectable()
export class AppService {
  private readonly startTime = Date.now();

  getHello() {
    return {
      message: API_CONFIG.welcomeMessage,
      version: API_CONFIG.version,
      documentation: API_CONFIG.documentationPath,
      endpoints: API_CONFIG.endpoints,
      timestamp: new Date().toISOString(),
    };
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000), // uptime in seconds
    };
  }

  getInfo() {
    return {
      name: API_CONFIG.name,
      version: API_CONFIG.version,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }
}
