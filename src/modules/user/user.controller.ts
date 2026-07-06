import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import * as userService from './user.service';
import { HTTP_STATUS } from '../../shared/constants/httpStatus';
import { parseListQueryParams } from '../../shared/utils/queryBuilder';

export const createUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(HTTP_STATUS.CREATED).json(
    ApiResponse.success(user, 'User created successfully', HTTP_STATUS.CREATED)
  );
});

export const listUsersHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.listUsers(parseListQueryParams(req.query));
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.paginated(result.data, result.meta, 'Users fetched successfully')
  );
});

export const getUserByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(user, 'User fetched successfully')
  );
});

export const updateUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(user, 'User updated successfully')
  );
});

export const deactivateUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.deactivateUser(req.params.id);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(user, 'User deactivated successfully')
  );
});
