import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').trim(),
  permissions: z
    .array(z.string())
    .min(1, 'At least one permission is required'),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1).trim().optional(),
  permissions: z.array(z.string()).min(1).optional(),
});

export type CreateRoleDto = z.infer<typeof createRoleSchema>;
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;
