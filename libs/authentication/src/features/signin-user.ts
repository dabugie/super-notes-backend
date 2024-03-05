import { PrismaClient } from '@super-notes/db-lib';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { comparePasswords } from '../utils/comparePasswords';
import { JwtService } from '@nestjs/jwt';
import { SigninUserDto } from '@super-notes/shared-models';

class Command {
  constructor(public readonly signinUserDto: SigninUserDto) {}
}

@CommandHandler(Command)
class Handler implements ICommandHandler<Command> {
  client = new PrismaClient();
  logger = new Logger('CreateUser.Handler');

  jwtService = new JwtService({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '24h' },
  });

  async execute(command: Command) {
    try {
      this.logger.log(
        `Signing in user with email ${command.signinUserDto.email}`,
      );

      const user = await this.client.user.findUnique({
        where: {
          email: command.signinUserDto.email,
        },
      });

      if (!user) {
        throw new Error(
          `User with email ${command.signinUserDto.email} not found`,
        );
      }

      const matchPassword = await comparePasswords(
        command.signinUserDto.password,
        user.password,
      );

      console.log({ matchPassword });

      if (!matchPassword) {
        throw new Error(
          `Password or email for user with email ${command.signinUserDto.email} is incorrect`,
        );
      }

      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload);

      this.logger.log(
        `User with email ${command.signinUserDto.email} signed in`,
      );

      return {
        access_token: token,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userData: user.userData,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

export const SigninUser = { Command, Handler };
