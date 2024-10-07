import { Response } from "express";

type ApiResponseData = Record<string, unknown> | null;

const apiResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: ApiResponseData = null
): Response => {
  return res.status(statusCode).json({
    status: {
      code: statusCode,
      message: message,
    },
    data: data,
  });
};

export default apiResponse;
