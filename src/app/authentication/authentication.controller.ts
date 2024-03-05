import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserStatus } from '@super-notes/authentication/features/get-user-status';
import { SigninUser } from '@super-notes/authentication/features/signin-user';
import { SignoutUser } from '@super-notes/authentication/features/signout-user';
import { SignupUser } from '@super-notes/authentication/features/signup-user';
import { SigninUserDto, SignupUserDto } from '@super-notes/shared-models';

@Controller('auth')
export class AuthenticationController {
  logger = new Logger(AuthenticationController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('signup')
  async signUp(@Body() signupUserDto: SignupUserDto) {
    try {
      const command = new SignupUser.Command(signupUserDto);
      const user = await this.commandBus.execute(command);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('signin')
  async signIn(@Body() signinUserDto: SigninUserDto) {
    try {
      const command = new SigninUser.Command(signinUserDto);
      const user = await this.commandBus.execute(command);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('signout')
  async signOut(@Headers('authorization') authorization: string) {
    try {
      const query = new SignoutUser.Query(authorization);
      const user = await this.queryBus.execute(query);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('status')
  async validateUser(@Headers('authorization') authorization: string) {
    try {
      const query = new GetUserStatus.Query(authorization);
      const user = await this.queryBus.execute(query);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
