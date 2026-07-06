import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import * as saleService from './sale.service';
import { HTTP_STATUS } from '../../shared/constants/httpStatus';
import { parseListQueryParams } from '../../shared/utils/queryBuilder';
import { UnauthorizedError } from '../../shared/errors/AppError';

export const createSaleHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }

  const sale = await saleService.createSale(req.body, req.user.userId);
  res.status(HTTP_STATUS.CREATED).json(
    ApiResponse.success(sale, 'Sale created successfully', HTTP_STATUS.CREATED)
  );
});

export const getSaleByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const sale = await saleService.getSaleById(req.params.id);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(sale, 'Sale fetched successfully')
  );
});

export const listSalesHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await saleService.listSales(parseListQueryParams(req.query));
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.paginated(result.data, result.meta, 'Sales fetched successfully')
  );
});
