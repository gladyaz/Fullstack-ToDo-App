// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  code?: string;
  errors?: any[];
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error Handler Triggered:', {
    name: error.name,
    message: error.message,
    status: error.status,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Sequelize Validation Errors
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Input data validation failed',
      details: error.errors?.map((err: any) => ({
        field: err.path,
        message: err.message,
        value: err.value
      })) || [],
      timestamp: new Date().toISOString()
    });
  }

  // Sequelize Unique Constraint Errors
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Duplicate Entry',
      message: 'A record with this information already exists',
      details: error.errors?.map((err: any) => ({
        field: err.path,
        message: `${err.path} must be unique`,
        value: err.value
      })) || [],
      timestamp: new Date().toISOString()
    });
  }

  // Sequelize Foreign Key Constraint Errors
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Invalid Reference',
      message: 'Referenced record does not exist',
      details: [{
        field: 'foreign_key',
        message: 'The referenced category or related record does not exist'
      }],
      timestamp: new Date().toISOString()
    });
  }

  // Sequelize Database Connection Errors
  if (error.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      error: 'Database Connection Error',
      message: 'Unable to connect to the database',
      timestamp: new Date().toISOString()
    });
  }

  // Express Validator Errors
  if (error.name === 'ValidationError' && error.errors) {
    return res.status(400).json({
      error: 'Input Validation Error',
      message: 'Request data validation failed',
      details: error.errors,
      timestamp: new Date().toISOString()
    });
  }

  // JWT Authentication Errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Authentication Error',
      message: 'Invalid or expired token',
      timestamp: new Date().toISOString()
    });
  }

  // Multer File Upload Errors
  if (error.name === 'MulterError') {
    return res.status(400).json({
      error: 'File Upload Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }

  // Custom Application Errors
  if (error.status) {
    return res.status(error.status).json({
      error: error.name || 'Application Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }

  // Default 500 Internal Server Error
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? error.message : 'Something went wrong on our end',
    ...(isDevelopment && { 
      stack: error.stack,
      details: error 
    }),
    timestamp: new Date().toISOString(),
    request: {
      method: req.method,
      path: req.path,
      ip: req.ip
    }
  });

  // Log error for monitoring
  console.error('💥 Unhandled Error Details:', {
    error: error.message,
    stack: error.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      ip: req.ip
    },
    timestamp: new Date().toISOString()
  });
};