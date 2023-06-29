import { CustomError } from "./custom-error";

export class RequestDatabaseConnectionError extends CustomError {
  public statusCode = 500;
  public reason = "Error connecting to database";

  constructor() {
    super();
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestDatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
