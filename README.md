# Industrix Todo Application

Full-stack Todo application built with React, Node.js, TypeScript, and PostgreSQL.

## 🚀 Features

- ✅ Complete CRUD operations for todos
- 📁 Category management system
- 🎯 Priority levels (Low, Medium, High)
- 📊 Real-time statistics dashboard
- 🔍 Advanced search and filtering
- 📱 Responsive design with Ant Design
- 🔄 Real-time data synchronization
- 🗄️ PostgreSQL database integration

## 🛠️ Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** framework
- **Sequelize ORM** for database operations
- **PostgreSQL** database
- **CORS** enabled for cross-origin requests
- **Validation** middleware for data integrity

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Ant Design** for UI components
- **Axios** for API communication
- **CSS3** for custom styling

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=industrix_todo
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
PORT=3001
```

4. Start the backend server:
```bash
npm run dev
```

Backend will run on: http://localhost:3001

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

Frontend will run on: http://localhost:5173 (or another available port)

## 🗄️ Database Schema

### Categories Table
- `id` (Primary Key)
- `name` (Unique, Required)
- `color` (Hex color code)
- `description` (Optional)
- `created_at`, `updated_at`

### Todos Table
- `id` (Primary Key)
- `title` (Required)
- `description` (Optional)
- `completed` (Boolean, default: false)
- `category_id` (Foreign Key to Categories)
- `priority` (Enum: low, medium, high)
- `due_date` (Optional)
- `created_at`, `updated_at`

## 🔌 API Endpoints

### Todos
- `GET /api/todos` - Get all todos with pagination and filtering
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `GET /api/todos/stats` - Get todo statistics

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## 🧪 Testing

Backend includes comprehensive API testing. Run tests with:
```bash
cd backend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Start production server: `npm start`

### Frontend Deployment
1. Build for production: `npm run build`
2. Deploy the `dist` folder to your hosting service

## 🔧 Development Notes

- Database automatically syncs and seeds initial data in development mode
- CORS is configured for local development
- Hot reload enabled for both frontend and backend
- TypeScript strict mode enabled for better code quality

## 📝 Recent Fixes

- ✅ Resolved database synchronization conflicts
- ✅ Fixed unique index duplication issues
- ✅ Improved error handling and logging
- ✅ Enhanced CORS configuration
- ✅ Optimized validation middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created as part of Industrix coding challenge.

---

**Status**: ✅ Fully functional and ready for production!
