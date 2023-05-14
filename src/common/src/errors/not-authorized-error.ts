import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  public statusCode = 401;

  constructor(public message: string) {
    super();

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
