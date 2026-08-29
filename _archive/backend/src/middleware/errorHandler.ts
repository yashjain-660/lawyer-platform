import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    error: message,
    statusCode,
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  res.status(statusCode).json({
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.path
  });
}
