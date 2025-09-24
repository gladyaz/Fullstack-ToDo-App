// backend/src/models/Todo.ts
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface TodoAttributes {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  category_id: number;
  priority: 'low' | 'medium' | 'high';
  due_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class Todo extends Model<TodoAttributes> implements TodoAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public completed!: boolean;
  public category_id!: number;
  public priority!: 'low' | 'medium' | 'high';
  public due_date?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Association methods
  public getCategory!: () => Promise<any>;
  public setCategory!: (category: any) => Promise<void>;
}

export const initTodo = (sequelize: Sequelize) => {
  Todo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Title cannot be empty'
          },
          len: {
            args: [1, 255],
            msg: 'Title must be between 1 and 255 characters'
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 2000],
            msg: 'Description must be less than 2000 characters'
          }
        }
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'Category ID must be an integer'
          },
          min: {
            args: [1],
            msg: 'Category ID must be positive'
          }
        },
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium',
        allowNull: false,
        validate: {
          isIn: {
            args: [['low', 'medium', 'high']],
            msg: 'Priority must be low, medium, or high'
          }
        }
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: {
            args: true,
            msg: 'Due date must be a valid date'
          },
          isAfter: {
            args: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
            msg: 'Due date cannot be in the past'
          }
        }
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Todo',
      tableName: 'todos',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['category_id']
        },
        {
          fields: ['completed']
        },
        {
          fields: ['priority']
        },
        {
          fields: ['due_date']
        },
        {
          fields: ['created_at']
        }
      ],
      hooks: {
        beforeValidate: (todo: Todo) => {
          // Trim whitespace from title
          if (todo.title) {
            todo.title = todo.title.trim();
          }
          if (todo.description) {
            todo.description = todo.description.trim();
          }
        },
        afterUpdate: (todo: Todo) => {
          console.log(`📝 Todo updated: ${todo.title} (ID: ${todo.id})`);
        },
        afterCreate: (todo: Todo) => {
          console.log(`✨ Todo created: ${todo.title} (ID: ${todo.id})`);
        },
        afterDestroy: (todo: Todo) => {
          console.log(`🗑️ Todo deleted: ${todo.title} (ID: ${todo.id})`);
        }
      }
    }
  );

  return Todo;
};