class AppError extends Error {
  readonly statusCode = 500;

  constructor(readonly message: string, readonly errorCode:string = 'app_error') {
    super(message);
  }
}

export default AppError;
