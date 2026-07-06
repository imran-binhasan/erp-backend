import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../shared/errors/AppError';

export const requirePermission = (...requiredPermissions: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userPermissions = new Set(req.user.permissions);

    if (userPermissions.has('*')) {
      next();
      return;
    }

    const hasAll = requiredPermissions.every((perm) => userPermissions.has(perm));

    if (!hasAll) {
      throw new ForbiddenError(
        `Missing required permission(s): ${requiredPermissions.join(', ')}`
      );
    }

    next();
  };
};
