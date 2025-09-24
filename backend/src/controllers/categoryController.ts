// backend/src/controllers/categoryController.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Category, Todo } from '../models';

export class CategoryController {
  // GET /api/categories - List all categories
  static async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('📁 Getting all categories');

      const categories = await Category.findAll({
        order: [['name', 'ASC']],
        include: [
          {
            model: Todo,
            as: 'todos',
            attributes: [],
            required: false
          }
        ],
        attributes: {
          include: [
            [
              Todo.sequelize!.fn('COUNT', Todo.sequelize!.col('todos.id')),
              'todo_count'
            ]
          ]
        },
        group: ['Category.id'],
        subQuery: false
      });

      console.log(`✅ Found ${categories.length} categories`);
      res.json({
        success: true,
        data: categories,
        total: categories.length
      });
    } catch (error) {
      console.error('❌ Error in getAllCategories:', error);
      next(error);
    }
  }

  // POST /api/categories - Create new category
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🏷️ Creating new category:', req.body);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation Error',
          details: errors.array() 
        });
      }

      const { name, color, description } = req.body;

      const category = await Category.create({
        name: name.trim(),
        color: color || '#3B82F6',
        description: description?.trim() || null,
      });

      console.log(`✅ Category created: ${category.name}`);
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ 
          error: 'Category already exists',
          message: 'A category with this name already exists' 
        });
      }
      console.error('❌ Error in createCategory:', error);
      next(error);
    }
  }

  // GET /api/categories/:id - Get specific category
  static async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`🔍 Getting category by ID: ${id}`);

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'Invalid ID',
          message: 'Category ID must be a valid integer' 
        });
      }

      const category = await Category.findByPk(id, {
        include: [
          {
            model: Todo,
            as: 'todos',
            attributes: ['id', 'title', 'completed', 'priority'],
          }
        ]
      });

      if (!category) {
        return res.status(404).json({ 
          error: 'Category not found',
          message: `Category with ID ${id} does not exist` 
        });
      }

      console.log(`✅ Category found: ${category.name}`);
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('❌ Error in getCategoryById:', error);
      next(error);
    }
  }

  // PUT /api/categories/:id - Update category
  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`📝 Updating category ID: ${id}`, req.body);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation Error',
          details: errors.array() 
        });
      }

      const { name, color, description } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ 
          error: 'Category not found',
          message: `Category with ID ${id} does not exist` 
        });
      }

      await category.update({
        name: name !== undefined ? name.trim() : category.name,
        color: color !== undefined ? color : category.color,
        description: description !== undefined ? (description?.trim() || null) : category.description,
      });

      console.log(`✅ Category updated: ${category.name}`);
      res.json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ 
          error: 'Category name already exists',
          message: 'A category with this name already exists' 
        });
      }
      console.error('❌ Error in updateCategory:', error);
      next(error);
    }
  }

  // DELETE /api/categories/:id - Delete category
  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`🗑️ Deleting category ID: ${id}`);

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'Invalid ID',
          message: 'Category ID must be a valid integer' 
        });
      }

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ 
          error: 'Category not found',
          message: `Category with ID ${id} does not exist` 
        });
      }

      // Check if category has todos
      const todoCount = await Todo.count({ where: { category_id: id } });
      if (todoCount > 0) {
        return res.status(400).json({ 
          error: 'Category has associated todos',
          message: `Cannot delete category '${category.name}' because it has ${todoCount} associated todos. Please move or delete the todos first.` 
        });
      }

      const categoryName = category.name;
      await category.destroy();

      console.log(`✅ Category deleted: ${categoryName}`);
      res.status(204).send();
    } catch (error) {
      console.error('❌ Error in deleteCategory:', error);
      next(error);
    }
  }
}