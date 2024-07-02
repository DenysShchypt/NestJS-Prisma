import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IJWTUser } from 'src/common/interfaces/auth';

export const CurrentUser = createParamDecorator(
  (
    key: keyof IJWTUser,
    ctx: ExecutionContext,
  ): IJWTUser | Partial<IJWTUser> => {
    const request = ctx.switchToHttp().getRequest();
    return key ? request.user[key] : request.user;
  },
);
