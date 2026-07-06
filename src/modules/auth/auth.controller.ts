import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { login as loginService, changePassword as changePasswordService } from './auth.service';
import { HTTP_STATUS } from '../../shared/constants/httpStatus';

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginService(email, password);

  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(result, 'Login successful')
  );
});

export const changePasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await changePasswordService(req.user!.userId, currentPassword, newPassword);

  res.status(HTTP_STATUS.OK).json(
    ApiResponse.success(null, 'Password changed successfully')
  );
});
