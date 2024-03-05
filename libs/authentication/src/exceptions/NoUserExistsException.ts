export class NoUserExistsException extends Error {
  constructor(userId: string) {
    super(`No user exists with id ${userId}`);
  }
}

export class NoUserExistsWithEmalException extends Error {
  constructor(email: string) {
    super(`No user exists with email ${email}`);
  }
}
