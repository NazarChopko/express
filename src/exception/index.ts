class ApiError extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }

  static notFound(message: string): ApiError {
    return new ApiError(404, message);
  }

  static internal(message: string): ApiError {
    return new ApiError(500, message);
  }

  static forbidden(message: string): ApiError {
    return new ApiError(403, message);
  }

  static unauthorized(message: string): ApiError {
    return new ApiError(401, message);
  }

  static badRequest(message: string): ApiError {
    return new ApiError(400, message);
  }

  static ok(message: string): ApiError {
    return new ApiError(200, message);
  }
}

export default ApiError;
