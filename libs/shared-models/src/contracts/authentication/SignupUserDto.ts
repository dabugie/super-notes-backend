import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class UserDataDto {
  [key: string]: unknown;
}

export class SignupUserDto {
  @IsString()
  @MinLength(1)
  @Matches(/^[a-zA-Z\s]*$/, {
    message: 'The first name must not contain special characters',
  })
  firstName: string;

  @IsString()
  @MinLength(1)
  @Matches(/^[a-zA-Z\s]*$/, {
    message: 'The last name must not contain special characters',
  })
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ValidateNested()
  @Type(() => UserDataDto)
  userData: Record<string, unknown>;
}
