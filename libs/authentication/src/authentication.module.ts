import { Module } from '@nestjs/common';
import { SigninUser } from './features/signin-user';
import { SignupUser } from './features/signup-user';
import { SignoutUser } from './features/signout-user';
import { GetUserByEmail } from './features/get-user-by-email';
import { GetUserStatus } from './features/get-user-status';

export const QueryHandlers = [
  GetUserByEmail.Handler,
  SignoutUser.Handler,
  GetUserStatus.Handler,
];

export const CommandHandlers = [SignupUser.Handler, SigninUser.Handler];

@Module({
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class AuthenticationModule {}
