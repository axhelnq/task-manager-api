import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegReq } from './dto/register.dto';
import { LoginReq } from './dto/login.dto';
import type { Request, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthRes } from './dto/auth.dto';
import { UserRes } from './dto/user.dto';
import { Authorization } from './decorators/authorization.decorator';
import { Authorized } from './decorators/authirized.decorator';
import type { User } from '@prisma/client';
import { ValidationErrorDto } from '../common/dto/validation-error.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description: 'Register a new user with the given email, name and password',
  })
  @ApiOkResponse({
    type: AuthRes,
    description: 'The user has been successfully registered',
  })
  @ApiBadRequestResponse({
    description: 'Incorrect input data',
    type: ValidationErrorDto,
  })
  @ApiConflictResponse({ description: 'User with this email already exists' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegReq,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res);
  }

  @ApiOperation({
    summary: 'Login to the system',
    description: 'Login to the system with the given email and password',
  })
  @ApiOkResponse({
    type: AuthRes,
    description: 'The user has been successfully registered',
  })
  @ApiBadRequestResponse({
    description: 'Incorrect input data',
    type: ValidationErrorDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginReq,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @ApiOperation({
    summary: 'Refresh the access token',
    description: 'Refresh the access token with the given refresh token',
  })
  @ApiOkResponse({
    type: AuthRes,
    description: 'The access token has been successfully refreshed',
  })
  @ApiUnauthorizedResponse({ description: 'Refresh token is not available' })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(req, res);
  }

  @ApiOperation({
    summary: 'Logout from the system',
    description:
      'Logout from the system by clearing refresh and access tokens from cookies',
  })
  @ApiOkResponse({
    description: 'User logged out successfully',
    schema: {
      type: 'boolean',
      example: true,
    },
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @ApiOperation({
    summary: 'Get current user information',
    description:
      'Returns the authenticated user information based on the JWT token',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserRes,
    description: 'The current user information has been successfully retrieved',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @Get('@me')
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async me(@Authorized() user: User) {
    return user;
  }
}
