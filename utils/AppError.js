export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }

  static badRequest(message) {
    return new AppError(400, message);
  }

  static unauthorized(message) {
    return new AppError(401, message);
  }

  static forbidden(message) {
    return new AppError(403, message);
  }

  static notFound(message) {
    return new AppError(404, message);
  }

  static internal(message) {
    return new AppError(500, message);
  }
}
