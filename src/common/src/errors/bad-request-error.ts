import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  public statusCode = 400;

  constructor(public message: string) {
    super();

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
