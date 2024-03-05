import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(messages: string[]) {
    super(messages);
  }
}
