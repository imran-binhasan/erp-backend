import Role from './role.model';
import User from '../user/user.model';
import { ConflictError, NotFoundError } from '../../shared/errors/AppError';
import { queryBuilder, type ListQueryParams } from '../../shared/utils/queryBuilder';
import { invalidateRolePermissions } from '../../shared/utils/permissionCache';

export const createRole = async (data: { name: string; permissions: string[] }) => {
  const existing = await Role.findOne({ name: data.name });
  if (existing) {
    throw new ConflictError(`Role "${data.name}" already exists`);
  }
  return Role.create(data);
};

export const listRoles = async (params: ListQueryParams) => {
  return queryBuilder(Role, {
    ...params,
    searchFields: ['name'],
  });
};

export const getRoleById = async (id: string) => {
  const role = await Role.findById(id);
  if (!role) throw new NotFoundError('Role not found');
  return role;
};

export const updateRole = async (
  id: string,
  data: { name?: string; permissions?: string[] }
) => {
  if (data.name) {
    const existing = await Role.findOne({ name: data.name, _id: { $ne: id } });
    if (existing) {
      throw new ConflictError(`Role "${data.name}" already exists`);
    }
  }

  const role = await Role.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });

  if (!role) throw new NotFoundError('Role not found');

  invalidateRolePermissions(id);

  return role;
};

export const deleteRole = async (id: string) => {
  const userCount = await User.countDocuments({ role: id });
  if (userCount > 0) {
    throw new ConflictError(
      `Cannot delete role: ${userCount} user(s) currently have this role`
    );
  }

  const role = await Role.findByIdAndDelete(id);
  if (!role) throw new NotFoundError('Role not found');

  invalidateRolePermissions(id);

  return role;
};
