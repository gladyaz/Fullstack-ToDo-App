// backend/src/controllers/todoController.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Todo, Category } from '../models';
import { Op } from 'sequelize';

export class TodoController {
  // GET /api/todos - List todos with pagination and filtering
  static async getAllTodos(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('📋 Getting all todos with filters:', req.query);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation Error',
          details: errors.array() 
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50); // Max 50 per page
      const search = req.query.search as string;
      const category_id = req.query.category_id as string;
      const completed = req.query.completed as string;
      const priority = req.query.priority as string;
      const sort_by = req.query.sort_by as string || 'created_at';
      const sort_order = (req.query.sort_order as string || 'DESC').toUpperCase();

      const offset = (page - 1) * limit;

      // Build where clause
      const whereClause: any = {};

      // Search in title and description
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Filter by category
      if (category_id && !isNaN(parseInt(category_id))) {
        whereClause.category_id = parseInt(category_id);
      }

      // Filter by completion status
      if (completed !== undefined) {
        whereClause.completed = completed === 'true';
      }

      // Filter by priority
      if (priority && ['low', 'medium', 'high'].includes(priority)) {
        whereClause.priority = priority;
      }

      // Validate sort field
      const validSortFields = ['title', 'created_at', 'updated_at', 'due_date', 'priority', 'completed'];
      const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
      const sortDirection = ['ASC', 'DESC'].includes(sort_order) ? sort_order : 'DESC';

      const { count, rows: todos } = await Todo.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'color'],
          }
        ],
        order: [[sortField, sortDirection]],
        limit,
        offset,
        distinct: true
      });

      const total_pages = Math.ceil(count / limit);

      console.log(`📊 Found ${count} todos, returning page ${page}/${total_pages}`);

      res.json({
        data: todos,
        pagination: {
          current_page: page,
          per_page: limit,
          total: count,
          total_pages,
        },
        filters: {
          search,
          category_id: category_id ? parseInt(category_id) : undefined,
          completed: completed ? completed === 'true' : undefined,
          priority,
          sort_by: sortField,
          sort_order: sortDirection
        }
      });
    } catch (error) {
      console.error('❌ Error in getAllTodos:', error);
      next(error);
    }
  }

  // POST /api/todos - Create new todo
  static async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('✨ Creating new todo:', req.body);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation Error',
          details: errors.array() 
        });
      }

      const { title, description, category_id, priority, due_date } = req.body;

      // Verify category exists
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ 
          error: 'Invalid category',
          message: `Category with ID ${category_id} does not exist` 
        });
      }

      const todo = await Todo.create({
        title: title.trim(),
        description: description?.trim() || null,
        category_id,
        priority: priority || 'medium',
        due_date: due_date ? new Date(due_date) : undefined,
        completed: false,
      });

      const createdTodo = await Todo.findByPk(todo.id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'color'],
          }
        ],
      });

      console.log(`✅ Todo created successfully: ${todo.title}`);
      res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: createdTodo
      });
    } catch (error) {
      console.error('❌ Error in createTodo:', error);
      next(error);
    }
  }

  // GET /api/todos/:id - Get specific todo
  static async getTodoById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`🔍 Getting todo by ID: ${id}`);

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'Invalid ID',
          message: 'Todo ID must be a valid integer' 
        });
      }

      const todo = await Todo.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'color'],
          }
        ],
      });

      if (!todo) {
        return res.status(404).json({ 
          error: 'Todo not found',
          message: `Todo with ID ${id} does not exist` 
        });
      }

      console.log(`✅ Todo found: ${todo.title}`);
      res.json({
        success: true,
        data: todo
      });
    } catch (error) {
      console.error('❌ Error in getTodoById:', error);
      next(error);
    }
  }

  // PUT /api/todos/:id - Update todo
  static async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`📝 Updating todo ID: ${id}`, req.body);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation Error',
          details: errors.array() 
        });
      }

      const { title, description, category_id, priority, due_date, completed } = req.body;

      const todo = await Todo.findByPk(id);
      if (!todo) {
        return res.status(404).json({ 
          error: 'Todo not found',
          message: `Todo with ID ${id} does not exist` 
        });
      }

      // Verify category exists if category_id is provided
      if (category_id && category_id !== todo.category_id) {
        const category = await Category.findByPk(category_id);
        if (!category) {
          return res.status(400).json({ 
            error: 'Invalid category',
            message: `Category with ID ${category_id} does not exist` 
          });
        }
      }

      await todo.update({
        title: title !== undefined ? title.trim() : todo.title,
        description: description !== undefined ? (description?.trim() || null) : todo.description,
        category_id: category_id !== undefined ? category_id : todo.category_id,
        priority: priority !== undefined ? priority : todo.priority,
        due_date: due_date !== undefined ? (due_date ? new Date(due_date) : undefined) : todo.due_date,
        completed: completed !== undefined ? completed : todo.completed,
      });

      const updatedTodo = await Todo.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'color'],
          }
        ],
      });

      console.log(`✅ Todo updated successfully: ${todo.title}`);
      res.json({
        success: true,
        message: 'Todo updated successfully',
        data: updatedTodo
      });
    } catch (error) {
      console.error('❌ Error in updateTodo:', error);
      next(error);
    }
  }

  // DELETE /api/todos/:id - Delete todo
  static async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`🗑️ Deleting todo ID: ${id}`);

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'Invalid ID',
          message: 'Todo ID must be a valid integer' 
        });
      }

      const todo = await Todo.findByPk(id);
      if (!todo) {
        return res.status(404).json({ 
          error: 'Todo not found',
          message: `Todo with ID ${id} does not exist` 
        });
      }

      const todoTitle = todo.title;
      await todo.destroy();

      console.log(`✅ Todo deleted successfully: ${todoTitle}`);
      res.status(204).send();
    } catch (error) {
      console.error('❌ Error in deleteTodo:', error);
      next(error);
    }
  }

  // PATCH /api/todos/:id/complete - Toggle completion status
  static async toggleComplete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`🔄 Toggling completion for todo ID: ${id}`);

      const todo = await Todo.findByPk(id);
      if (!todo) {
        return res.status(404).json({ 
          error: 'Todo not found',
          message: `Todo with ID ${id} does not exist` 
        });
      }

      const newStatus = !todo.completed;
      await todo.update({ completed: newStatus });

      const updatedTodo = await Todo.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'color'],
          }
        ],
      });

      console.log(`✅ Todo ${newStatus ? 'completed' : 'reopened'}: ${todo.title}`);
      res.json({
        success: true,
        message: `Todo marked as ${newStatus ? 'completed' : 'pending'}`,
        data: updatedTodo
      });
    } catch (error) {
      console.error('❌ Error in toggleComplete:', error);
      next(error);
    }
  }

  // GET /api/todos/stats - Get todo statistics
  static async getTodoStats(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('📊 Getting todo statistics');

      const totalTodos = await Todo.count();
      const completedTodos = await Todo.count({ where: { completed: true } });
      const pendingTodos = await Todo.count({ where: { completed: false } });
      const highPriorityTodos = await Todo.count({ 
        where: { 
          priority: 'high',
          completed: false 
        } 
      });

      // Get todos by category
      const todosByCategory = await Todo.findAll({
        attributes: ['category_id'],
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['name', 'color']
          }
        ],
        group: ['category_id', 'category.id', 'category.name', 'category.color'],
        raw: false
      });

      const stats = {
        total: totalTodos,
        completed: completedTodos,
        pending: pendingTodos,
        high_priority_pending: highPriorityTodos,
        completion_rate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0,
        categories: todosByCategory.length
      };

      console.log('📊 Stats calculated:', stats);
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('❌ Error in getTodoStats:', error);
      next(error);
    }
  }
}