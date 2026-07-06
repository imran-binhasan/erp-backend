import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import * as customerService from './customer.service';
import { HTTP_STATUS } from '../../shared/constants/httpStatus';
import { parseListQueryParams } from '../../shared/utils/queryBuilder';

export const createCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.createCustomer(req.body);
  res.status(HTTP_STATUS.CREATED).json(
    ApiResponse.success(customer, 'Customer created successfully', HTTP_STATUS.CREATED)
  );
});

export const listCustomersHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await customerService.listCustomers(parseListQueryParams(req.query));
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.paginated(result.data, result.meta, 'Customers fetched successfully')
  );
});

export const getCustomerByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.getCustomerById(req.params.id);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(customer, 'Customer fetched successfully')
  );
});

export const updateCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.updateCustomer(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(customer, 'Customer updated successfully')
  );
});

export const deleteCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  await customerService.deleteCustomer(req.params.id);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(null, 'Customer deleted successfully')
  );
});
