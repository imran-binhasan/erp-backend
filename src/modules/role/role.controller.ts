import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import * as roleService from './role.service';
import { HTTP_STATUS } from '../../shared/constants/httpStatus';
import { parseListQueryParams } from '../../shared/utils/queryBuilder';

export const createRoleHandler = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.createRole(req.body);
  res.status(HTTP_STATUS.CREATED).json(
    ApiResponse.success(role, 'Role created successfully', HTTP_STATUS.CREATED)
  );
});

export const listRolesHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await roleService.listRoles(parseListQueryParams(req.query));
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.paginated(result.data, result.meta, 'Roles fetched successfully')
  );
});

export const getRoleByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.getRoleById(req.params.id);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(role, 'Role fetched successfully')
  );
});

export const updateRoleHandler = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.updateRole(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(role, 'Role updated successfully')
  );
});

export const deleteRoleHandler = asyncHandler(async (req: Request, res: Response) => {
  await roleService.deleteRole(req.params.id);
  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(null, 'Role deleted successfully')
  );
});
