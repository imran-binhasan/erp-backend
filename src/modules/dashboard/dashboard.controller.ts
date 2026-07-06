import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { getDashboardStats } from './dashboard.service';
import { HTTP_STATUS } from '../../shared/constants/httpStatus';

export const getDashboardStatsHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await getDashboardStats();
    res.status(HTTP_STATUS.OK).json(
      ApiResponse.success(stats, 'Dashboard stats fetched successfully')
    );
  }
);
