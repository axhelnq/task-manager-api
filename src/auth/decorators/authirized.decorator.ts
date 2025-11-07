import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@prisma/client';

interface RequestWithUser {
  user: User;
}

export const Authorized = createParamDecorator(
  <K extends keyof User>(data: K | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // Перевірка на випадок, якщо декоратор використано без AuthGuard
    if (!user) {
      throw new InternalServerErrorException(
        'User not found in request. Did you forget to apply an AuthGuard?',
      );
    }

    return data ? user[data] : user;
  },
);
