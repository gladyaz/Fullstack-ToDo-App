// backend/src/models/Category.ts
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface CategoryAttributes {
  id?: number;
  name: string;
  color: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public color!: string;
  public description?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Association methods
  public getTodos!: () => Promise<any[]>;
  public countTodos!: () => Promise<number>;
  public hasTodos!: () => Promise<boolean>;
}

export const initCategory = (sequelize: Sequelize) => {
  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Category name cannot be empty'
          },
          len: {
            args: [1, 100],
            msg: 'Category name must be between 1 and 100 characters'
          },
          isAlphanumeric: {
            msg: 'Category name must contain only letters, numbers, and spaces'
          }
        }
      },
      color: {
        type: DataTypes.STRING(7),
        allowNull: false,
        defaultValue: '#3B82F6',
        validate: {
          is: {
            args: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
            msg: 'Color must be a valid hex color (e.g., #FF0000 or #F00)'
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 500],
            msg: 'Description must be less than 500 characters'
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
      modelName: 'Category',
      tableName: 'categories',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['name']
        }
      ],
      hooks: {
        beforeValidate: (category: Category) => {
          // Trim and capitalize category name
          if (category.name) {
            category.name = category.name.trim();
            category.name = category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase();
          }
          
          // Ensure color starts with #
          if (category.color && !category.color.startsWith('#')) {
            category.color = '#' + category.color;
          }
        },
        afterCreate: (category: Category) => {
          console.log(`🏷️ Category created: ${category.name} (${category.color})`);
        },
        afterUpdate: (category: Category) => {
          console.log(`📝 Category updated: ${category.name} (ID: ${category.id})`);
        },
        beforeDestroy: async (category: Category) => {
          // Check if category has todos before deletion
          const todoCount = await category.countTodos();
          if (todoCount > 0) {
            throw new Error(`Cannot delete category '${category.name}' because it has ${todoCount} associated todos`);
          }
          console.log(`🗑️ Category deleted: ${category.name} (ID: ${category.id})`);
        }
      }
    }
  );

  return Category;
};