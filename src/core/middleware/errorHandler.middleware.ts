import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';
import { env } from '../../env';
import { ApiResponse } from '../../shared/utils/ApiResponse';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(ApiResponse.error(err.message, err.statusCode));
    return;
  }

  console.error('Unhandled error:', err);

  res
    .status(500)
    .json(
      ApiResponse.error(
        env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        500
      )
    );
};
