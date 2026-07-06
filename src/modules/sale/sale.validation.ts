import { z } from 'zod';

const saleItemSchema = z.object({
  product: z.string().min(1, 'Product ID is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
});

export const createSaleSchema = z.object({
  customer: z.string().min(1, 'Customer ID is required'),
  items: z.array(saleItemSchema).min(1, 'At least one item is required'),
});

export type CreateSaleDto = z.infer<typeof createSaleSchema>;
