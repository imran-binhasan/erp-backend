export class ApiResponse {
  static success<T>(data: T, message = 'Success', statusCode = 200) {
    return {
      success: true,
      data,
      message,
      statusCode,
    };
  }

  static error(message: string, statusCode = 500, errors?: unknown[]) {
    return {
      success: false,
      message,
      statusCode,
      ...(errors ? { errors } : {}),
    };
  }

  static paginated<T>(
    data: T[],
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    },
    message = 'Success',
    statusCode = 200
  ) {
    return {
      success: true,
      data,
      meta,
      message,
      statusCode,
    };
  }
}
