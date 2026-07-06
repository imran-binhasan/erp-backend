import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import { HTTP_STATUS } from '../../shared/constants/httpStatus';
import { ApiResponse } from '../../shared/utils/ApiResponse';

export const validate =
  (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
          ApiResponse.error(
            'Validation failed',
            HTTP_STATUS.BAD_REQUEST,
            error.errors.map((e) => ({
              field: e.path.join('.'),
              message: e.message,
            }))
          )
        );
        return;
      }
      next(error);
    }
  };
