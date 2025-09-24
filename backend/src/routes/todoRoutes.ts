// backend/src/routes/todoRoutes.ts
import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { TodoController } from '../controllers/todoController';

const router = Router();

// Validation middleware for creating todos
const todoCreateValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  
  body('description')
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Valid category_id is required'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('due_date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Due date must be a valid ISO 8601 date'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value')
];

// Validation middleware for updating todos (all fields optional)
const todoUpdateValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  
  body('description')
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid category_id is required'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('due_date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Due date must be a valid ISO 8601 date'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Search term must be less than 200 characters'),
  
  query('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  
  query('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed filter must be true or false'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority filter must be low, medium, or high'),
  
  query('sort_by')
    .optional()
    .isIn(['title', 'created_at', 'updated_at', 'due_date', 'priority', 'completed'])
    .withMessage('Invalid sort field'),
  
  query('sort_order')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Sort order must be ASC or DESC')
];

const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid todo ID is required')
];

// Routes with validation
console.log('📋 Setting up todo routes...');

// GET /api/todos - List todos with pagination and filtering
router.get('/', queryValidation, TodoController.getAllTodos);

// GET /api/todos/stats - Get todo statistics
router.get('/stats', TodoController.getTodoStats);

// POST /api/todos - Create new todo
router.post('/', todoCreateValidation, TodoController.createTodo);

// GET /api/todos/:id - Get specific todo
router.get('/:id', idValidation, TodoController.getTodoById);

// PUT /api/todos/:id - Update todo
router.put('/:id', [...idValidation, ...todoUpdateValidation], TodoController.updateTodo);

// PATCH /api/todos/:id/complete - Toggle completion status
router.patch('/:id/complete', idValidation, TodoController.toggleComplete);

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', idValidation, TodoController.deleteTodo);

console.log('✅ Todo routes configured successfully');

export default router;