import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import * as productService from './product.service';
import { HTTP_STATUS } from '../../shared/constants/httpStatus';
import { parseListQueryParams } from '../../shared/utils/queryBuilder';

export const createProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body, req.file);
  res.status(HTTP_STATUS.CREATED).json(
    ApiResponse.success(product, 'Product created successfully', HTTP_STATUS.CREATED)
  );
});

export const listProductsHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.listProducts(parseListQueryParams(req.query));
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.paginated(result.data, result.meta, 'Products fetched successfully')
  );
});

export const getProductByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(product, 'Product fetched successfully')
  );
});

export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.file);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(product, 'Product updated successfully')
  );
});

export const deleteProductHandler = asyncHandler(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(null, 'Product deleted successfully')
  );
});
