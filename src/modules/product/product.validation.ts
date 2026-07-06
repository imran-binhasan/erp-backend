import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').trim(),
  sku: z.string().min(1, 'SKU is required').trim().toUpperCase(),
  category: z.string().min(1, 'Category is required').trim(),
  purchasePrice: z.coerce.number().min(0, 'Purchase price cannot be negative'),
  sellingPrice: z.coerce.number().min(0, 'Selling price cannot be negative'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).trim().optional(),
  sku: z.string().min(1).trim().toUpperCase().optional(),
  category: z.string().min(1).trim().optional(),
  purchasePrice: z.coerce.number().min(0).optional(),
  sellingPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
