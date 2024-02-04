export class NoNoteExistsException extends Error {
  constructor(noteId: string) {
    super(`Note with id ${noteId} does not exist`);
  }
}
