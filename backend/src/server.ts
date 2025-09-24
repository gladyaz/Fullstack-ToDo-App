// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import models dan database
import { sequelize, Todo, Category } from './models';

// Import routes (akan kita buat setelah ini)
import todoRoutes from './routes/todoRoutes';
import categoryRoutes from './routes/categoryRoutes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

console.log('🔄 Initializing Industrix Todo Backend with Database...');
console.log('📁 Working directory:', process.cwd());
console.log('🔧 Node environment:', process.env.NODE_ENV || 'development');

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  process.env.CORS_ORIGIN
].filter(Boolean);

console.log('🚀 Setting up middleware...');

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS middleware
app.use(cors({
  origin: CORS_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

console.log('🛣️  Setting up routes...');

// Health check endpoint
app.get('/health', async (req, res) => {
  console.log('📊 Health check requested');
  
  try {
    // Test database connection
    await sequelize.authenticate();
    const todoCount = await Todo.count();
    const categoryCount = await Category.count();
    
    res.json({
      status: 'OK',
      message: 'Industrix Todo Backend is running with database!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
      uptime: process.uptime(),
      database: {
        connected: true,
        todos: todoCount,
        categories: categoryCount
      }
    });
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint requested');
  res.json({
    message: 'Welcome to Industrix Todo API with Database',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      todos: '/api/todos',
      categories: '/api/categories'
    },
    features: [
      'PostgreSQL Database Integration',
      'Sequelize ORM',
      'RESTful API Design',
      'TypeScript Support',
      'Request Validation',
      'Error Handling',
      'CORS Enabled'
    ],
    documentation: 'https://github.com/industrix/todo-api',
    timestamp: new Date().toISOString()
  });
});

// API routes - Real database integration
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Industrix Todo API v1.0.0 - Database Powered',
    status: 'active',
    database: 'PostgreSQL with Sequelize ORM',
    endpoints: {
      todos: {
        list: 'GET /api/todos',
        create: 'POST /api/todos',
        get: 'GET /api/todos/:id',
        update: 'PUT /api/todos/:id',
        delete: 'DELETE /api/todos/:id',
        toggle: 'PATCH /api/todos/:id/complete',
        stats: 'GET /api/todos/stats'
      },
      categories: {
        list: 'GET /api/categories',
        create: 'POST /api/categories',
        get: 'GET /api/categories/:id',
        update: 'PUT /api/categories/:id',
        delete: 'DELETE /api/categories/:id'
      }
    },
    features: {
      pagination: 'Query params: page, limit (max 50)',
      search: 'Query param: search (title and description)',
      filtering: 'Query params: category_id, completed, priority',
      sorting: 'Query params: sort_by, sort_order'
    }
  });
});

// 404 handler - Fixed version
app.use((req, res, next) => {
  console.log('❓ 404 - Route not found:', req.originalUrl);
  res.status(404).json({
    error: 'Route not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /health',
      'GET /',
      'GET /api',
      'GET /api/todos',
      'POST /api/todos',
      'GET /api/categories',
      'POST /api/categories'
    ],
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received. Shutting down gracefully...');
  sequelize.close().then(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received. Shutting down gracefully...');
  sequelize.close().then(() => process.exit(0));
});

console.log('🚀 Starting server with database...');
console.log(`🔌 Port: ${PORT}`);
console.log(`🌐 CORS Origins: ${CORS_ORIGINS.join(', ')}`);
console.log(`🗄️ Database: ${process.env.DB_NAME || 'industrix_todo'}`);

// Database connection and server startup
const startServer = async () => {
  try {
    console.log('🔄 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established!');
    
    // Sync models in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Synchronizing database models...');
      await sequelize.sync({ alter: true });
      console.log('📊 Database models synchronized!');
    }
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log('\n' + '='.repeat(70));
      console.log('🎉 INDUSTRIX TODO BACKEND WITH DATABASE STARTED!');
      console.log('='.repeat(70));
      console.log(`🚀 Server running on: http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔍 API Explorer: http://localhost:${PORT}/api`);
      console.log(`📋 Todos API: http://localhost:${PORT}/api/todos`);
      console.log(`📁 Categories API: http://localhost:${PORT}/api/categories`);
      console.log('='.repeat(70));
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️ Database: ${process.env.DB_NAME || 'industrix_todo'}`);
      console.log(`⏰ Started at: ${new Date().toISOString()}`);
      console.log(`💻 PID: ${process.pid}`);
      console.log('='.repeat(70) + '\n');
      console.log('🎯 Ready to accept connections with database integration!');
      console.log('📝 Logs will appear below...\n');
    });

    // Handle server startup errors
    server.on('error', (err: any) => {
      console.error('\n❌ SERVER STARTUP ERROR:');
      console.error('='.repeat(40));
      
      if (err.code === 'EADDRINUSE') {
        console.error(`🚫 Port ${PORT} is already in use!`);
        console.error('💡 Solutions:');
        console.error('   1. Change PORT in .env file (e.g., PORT=3002)');
        console.error('   2. Kill existing process: taskkill /F /PID <PID>');
        console.error('   3. Find process: netstat -an | findstr :' + PORT);
      } else {
        console.error('❌ Error:', err.message);
      }
      
      console.error('='.repeat(40));
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('💡 Check database connection and environment variables');
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;