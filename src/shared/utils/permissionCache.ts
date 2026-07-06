import NodeCache from 'node-cache';

const permissionCache = new NodeCache({ stdTTL: 60 });

const getCacheKey = (roleId: string) => `role_permissions_${roleId}`;

export const getCachedRolePermissions = async (
  roleId: string,
  loader: () => Promise<string[]>
): Promise<string[]> => {
  const cacheKey = getCacheKey(roleId);
  const cached = permissionCache.get<string[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const permissions = await loader();
  permissionCache.set(cacheKey, permissions);
  return permissions;
};

export const invalidateRolePermissions = (roleId: string): void => {
  permissionCache.del(getCacheKey(roleId));
};
