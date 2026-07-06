import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../shared/utils/jwt.util';
import { UnauthorizedError } from '../../shared/errors/AppError';
import Role from '../../modules/role/role.model';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { getCachedRolePermissions } from '../../shared/utils/permissionCache';

const getPermissions = async (roleId: string): Promise<string[]> => {
  return getCachedRolePermissions(roleId, async () => {
    const role = await Role.findById(roleId).lean();
    return role?.permissions ?? [];
  });
};

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyToken(token);
      const permissions = decoded.roleId
        ? await getPermissions(decoded.roleId)
        : decoded.permissions || [];

      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        permissions,
      };
      next();
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
);

