export class UserAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`There's already a user with email ${email}`);
  }
}
