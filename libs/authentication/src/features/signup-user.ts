import { PrismaClient } from '@super-notes/db-lib';
import { SignupUserDto } from '@super-notes/shared-models';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserAlreadyExistsException } from '../exceptions/UserAlreadyExistsException';
import { encryptPassword } from '../utils/encryptPassword';

class Command {
  constructor(public readonly signupUserDto: SignupUserDto) {}
}

@CommandHandler(Command)
class Handler implements ICommandHandler<Command> {
  client = new PrismaClient();
  logger = new Logger('CreateUser.Handler');
  JwtService = new JwtService({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '24h' },
  });

  async execute(command: Command) {
    try {
      this.logger.log(
        `Creating user with email ${command.signupUserDto.email}`,
      );

      const existingUser = await this.client.user.findMany({
        where: {
          OR: [{ email: command.signupUserDto.email }],
        },
      });

      if (existingUser.length > 0) {
        throw new UserAlreadyExistsException(command.signupUserDto.email);
      }

      const newUser = await this.client.user.create({
        data: {
          firstName: command.signupUserDto.firstName,
          lastName: command.signupUserDto.lastName,
          email: command.signupUserDto.email,
          password: await encryptPassword(command.signupUserDto.password),
          userData: command.signupUserDto.userData as object,
        },
      });
      const payload = { sub: newUser.id, email: newUser.email };
      const token = await this.JwtService.signAsync(payload);

      this.logger.log(`User created with id ${newUser.id}`);

      return {
        access_token: token,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userData: newUser.userData,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

export const SignupUser = { Command, Handler };
