// backend/src/routes/categoryRoutes.ts
import { Router } from 'express';
import { body, param } from 'express-validator';
import { CategoryController } from '../controllers/categoryController';

const router = Router();

// Validation middleware
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Category name can only contain letters, numbers, and spaces'),
  
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color (e.g., #FF0000 or #F00)'),
  
  body('description')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
];

const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required')
];

// Routes with validation
console.log('📁 Setting up category routes...');

// GET /api/categories - List all categories
router.get('/', CategoryController.getAllCategories);

// POST /api/categories - Create new category
router.post('/', categoryValidation, CategoryController.createCategory);

// GET /api/categories/:id - Get specific category
router.get('/:id', idValidation, CategoryController.getCategoryById);

// PUT /api/categories/:id - Update category
router.put('/:id', [...idValidation, ...categoryValidation], CategoryController.updateCategory);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', idValidation, CategoryController.deleteCategory);

console.log('✅ Category routes configured successfully');

export default router;