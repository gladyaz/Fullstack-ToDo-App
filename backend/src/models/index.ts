// backend/src/models/index.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { initTodo } from './Todo';
import { initCategory } from './Category';

// Load environment variables
dotenv.config();

console.log('🔄 Initializing database connection...');
console.log('📊 DB Host:', process.env.DB_HOST);
console.log('📊 DB Name:', process.env.DB_NAME);
console.log('📊 DB User:', process.env.DB_USER);

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'industrix_todo',
  process.env.DB_USER || 'postgres', 
  process.env.DB_PASSWORD || 'password123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Initialize models
const Todo = initTodo(sequelize);
const Category = initCategory(sequelize);

// Define model associations
console.log('🔗 Setting up model associations...');
Category.hasMany(Todo, { 
  foreignKey: 'category_id', 
  as: 'todos',
  onDelete: 'CASCADE'
});

Todo.belongsTo(Category, { 
  foreignKey: 'category_id', 
  as: 'category'
});

// Test database connection
const testConnection = async () => {
  try {
    console.log('🔄 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully!');
    
    // Sync models (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Synchronizing database models...');
      try {
        // Drop all tables and recreate from scratch
        console.log('🔄 Dropping all tables and recreating...');
        await sequelize.drop();
        console.log('🗑️ All tables dropped');
        
        // Sync with force to recreate everything
        await sequelize.sync({ force: true });
        console.log('📊 Database models synchronized!');
      } catch (syncError: any) {
        console.error('❌ Database sync failed:', syncError.message);
        throw syncError;
      }
      
      // Seed initial data
      await seedInitialData();
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    return false;
  }
};

// Seed initial data
const seedInitialData = async () => {
  try {
    console.log('🌱 Seeding initial data...');
    
    // Check if categories exist
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      const categories = await Category.bulkCreate([
        { name: 'Work', color: '#3B82F6' },
        { name: 'Personal', color: '#10B981' },
        { name: 'Shopping', color: '#F59E0B' },
        { name: 'Health', color: '#EF4444' },
      ]);
      console.log('📁 Categories seeded:', categories.length);
    }
    
    // Check if todos exist
    const todoCount = await Todo.count();
    if (todoCount === 0) {
      const workCategory = await Category.findOne({ where: { name: 'Work' } });
      const personalCategory = await Category.findOne({ where: { name: 'Personal' } });
      const shoppingCategory = await Category.findOne({ where: { name: 'Shopping' } });
      
      const todos = await Todo.bulkCreate([
        {
          title: 'Complete Industrix Coding Challenge',
          description: 'Build a comprehensive full-stack todo application with React, Node.js, and PostgreSQL',
          completed: false,
          category_id: workCategory?.id || 1,
          priority: 'high',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
        },
        {
          title: 'Setup Backend API',
          description: 'Create Express server with TypeScript, Sequelize ORM, and PostgreSQL database',
          completed: true,
          category_id: workCategory?.id || 1,
          priority: 'high'
        },
        {
          title: 'Build Frontend Interface',
          description: 'React application with TypeScript, Ant Design, and responsive design',
          completed: true,
          category_id: workCategory?.id || 1,
          priority: 'high'
        },
        {
          title: 'Weekly grocery shopping',
          description: 'Buy milk, bread, eggs, fruits, vegetables, and cleaning supplies',
          completed: false,
          category_id: shoppingCategory?.id || 3,
          priority: 'medium'
        },
        {
          title: 'Read programming books',
          description: 'Continue reading "Clean Code" by Robert Martin and "Design Patterns"',
          completed: false,
          category_id: personalCategory?.id || 2,
          priority: 'low'
        }
      ]);
      console.log('📋 Todos seeded:', todos.length);
    }
    
    console.log('✅ Initial data seeding completed');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

// Initialize connection
testConnection();

export { sequelize, Todo, Category, testConnection };
