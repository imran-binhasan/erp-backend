import type { Request, Response, NextFunction } from 'express';
import { env } from '../../env';
import { ApiResponse } from '../../shared/utils/ApiResponse';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const key = req.ip || 'unknown';
  const now = Date.now();

  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + env.RATE_LIMIT_WINDOW_MS,
    };
  }

  store[key].count++;

  if (store[key].count > env.RATE_LIMIT_MAX) {
    res
      .status(429)
      .json(ApiResponse.error('Too many requests, please try again later', 429));
    return;
  }

  next();
};
