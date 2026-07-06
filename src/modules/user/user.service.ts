import User from './user.model';
import { hashPassword } from '../../shared/utils/password.util';
import { ConflictError, NotFoundError } from '../../shared/errors/AppError';
import { queryBuilder, type ListQueryParams } from '../../shared/utils/queryBuilder';

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new ConflictError('A user with this email already exists');
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  return User.findById(user._id).populate('role');
};

export const listUsers = async (params: ListQueryParams) => {
  const result = await queryBuilder(User, {
    ...params,
    searchFields: ['name', 'email'],
  }, { deletedAt: null });

  const populated = await User.populate(result.data, { path: 'role' });
  return { ...result, data: populated };
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).populate('role');
  if (!user) throw new NotFoundError('User not found');
  return user;
};

export const updateUser = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    deletedAt?: Date | null;
  }
) => {
  if (data.email) {
    const existing = await User.findOne({ email: data.email, _id: { $ne: id } });
    if (existing) {
      throw new ConflictError('A user with this email already exists');
    }
  }

  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  if (data.deletedAt === null || data.deletedAt) {
    const updated = await User.findOneAndUpdate(
      { _id: id },
      { deletedAt: data.deletedAt || new Date() },
      { new: true }
    ).populate('role');

    if (!updated) throw new NotFoundError('User not found');
    return updated;
  }

  const user = await User.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  }).populate('role');

  if (!user) throw new NotFoundError('User not found');
  return user;
};

export const deactivateUser = async (id: string) => {
  const user = await User.findOneAndUpdate(
    { _id: id },
    { deletedAt: new Date() },
    { new: true }
  ).populate('role');

  if (!user) throw new NotFoundError('User not found');
  return user;
};
