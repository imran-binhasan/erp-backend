import User from '../user/user.model';
import { comparePassword, hashPassword } from '../../shared/utils/password.util';
import { signToken } from '../../shared/utils/jwt.util';
import { UnauthorizedError, BadRequestError } from '../../shared/errors/AppError';
import type { IUser } from '../user/user.model';

export const login = async (email: string, password: string) => {
  const user = (await User.findOne({ email })
    .select('+password')
    .populate<{ role: { _id: unknown; name: string; permissions: string[] } }>('role')) as
    | (IUser & {
        password: string;
        role: { _id: unknown; name: string; permissions: string[] };
      })
    | null;

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const roleId = String(user.role._id || '');
  const roleName = user.role.name || '';
  const rolePermissions = user.role.permissions || [];

  const token = signToken({
    userId: user._id.toString(),
    role: roleName,
    roleId,
    permissions: rolePermissions,
  });

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: {
        _id: String(user.role._id),
        name: roleName,
        permissions: rolePermissions,
      },
    },
  };
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new BadRequestError('Current password is incorrect');
  }

  user.password = await hashPassword(newPassword);
  await user.save();
};
