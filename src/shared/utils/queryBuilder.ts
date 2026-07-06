import type { FilterQuery, Model } from 'mongoose';
import { z } from 'zod';

const listQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  stockStatus: z.enum(['inStock', 'lowStock', 'outOfStock']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
  sort: z.string().default('-createdAt'),
});

export interface ListQueryParams {
  search?: string;
  category?: string;
  stockStatus?: 'inStock' | 'lowStock' | 'outOfStock';
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
  sort: string;
}

export interface QueryBuilderParams<T> extends ListQueryParams {
  searchFields?: string[];
  useTextSearch?: boolean;
  filters?: FilterQuery<T>;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const parseListQueryParams = (query: unknown): ListQueryParams =>
  listQuerySchema.parse(query);

export async function queryBuilder<T>(
  model: Model<T>,
  params: QueryBuilderParams<T>,
  baseFilter: FilterQuery<T> = {}
): Promise<PaginatedResult<T>> {
  const {
    search,
    searchFields,
    page = 1,
    limit = 10,
    sort = '-createdAt',
    filters = {},
    useTextSearch = false,
  } = params;

  const filter: FilterQuery<T> = {
    ...baseFilter,
    ...filters,
  };

  if (search && searchFields && searchFields.length > 0) {
    if (useTextSearch) {
      filter.$text = { $search: search };
    } else {
      const searchConditions = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })) as FilterQuery<T>[];
      filter.$or = searchConditions;
    }
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit).lean() as Promise<T[]>,
    model.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}
