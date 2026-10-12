export class ApplicationError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = 'ApplicationError';
  }
}
