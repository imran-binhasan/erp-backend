import type { CorsOptions } from 'cors';
import { env } from '../env';

const DEV_ORIGIN_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

function getAllowedOrigins(): string[] {
  return env.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function isOriginAllowed(origin: string): boolean {
  if (getAllowedOrigins().includes(origin)) return true;
  if (env.NODE_ENV === 'development' && DEV_ORIGIN_PATTERN.test(origin)) return true;
  return false;
}

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || isOriginAllowed(origin)) {
      callback(null, origin ?? true);
      return;
    }
    callback(null, false);
  },
  credentials: true,
};
