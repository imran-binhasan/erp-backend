import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Role is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).trim().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.string().min(1).optional(),
  deletedAt: z.string().nullable().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
