// frontend/src/components/TodoApp.tsx
import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Input,
  Space,
  Row,
  Col,
  Drawer,
  Typography,
  List,
  Checkbox,
  Empty,
  Spin,
  Form,
  Select,
  Modal,
  Divider,
  message,
  Tag,
  Tooltip,
  Badge,
  Statistic,
  Alert,
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  ClearOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RocketOutlined,
  HeartOutlined,
  ShoppingOutlined,
  UserOutlined,
  BugOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TextArea } = Input;

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Types
interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  category_id: number;
  category: {
    id: number;
    name: string;
    color: string;
  };
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  due_date?: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
  createdAt: string;
}

interface ApiResponse {
  message: string;
  data: Todo[] | Category[];
  total: number;
  status: string;
}

interface TodoFilters {
  search?: string;
  category?: string;
  priority?: string;
  completed?: boolean;
}

// API Service
const api = {
  async getHealth() {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  },
  
  async getTodos(): Promise<ApiResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/todos`);
    return response.data;
  },
  
  async getCategories(): Promise<ApiResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/categories`);
    return response.data;
  },

  async createTodo(todoData: any) {
    const response = await axios.post(`${API_BASE_URL}/api/todos`, todoData);
    return response.data;
  },

  async updateTodo(id: number, todoData: any) {
    const response = await axios.put(`${API_BASE_URL}/api/todos/${id}`, todoData);
    return response.data;
  },

  async deleteTodo(id: number) {
    const response = await axios.delete(`${API_BASE_URL}/api/todos/${id}`);
    return response.data;
  },

  async toggleTodo(id: number, completed: boolean) {
    const response = await axios.put(`${API_BASE_URL}/api/todos/${id}`, { completed });
    return response.data;
  }
};

// TodoStats Component - INI YANG BISA DIUBAH WARNANYA
const TodoStats: React.FC<{ todos: Todo[] }> = ({ todos }) => {
  const completed = todos.filter(t => t.completed).length;
  const pending = todos.filter(t => !t.completed).length;
  const highPriority = todos.filter(t => t.priority === 'high' && !t.completed).length;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      {/* TOTAL CARD - UBAH BACKGROUND INI */}
      <Col xs={6} sm={6} md={6} lg={6}>
        <Card style={{ 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)', // 🔹 WARNA TOTAL
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        }}>
          <Statistic
            title={<span style={{ color: 'white', fontSize: '12px', fontWeight: '500' }}>Total Todos</span>}
            value={todos.length}
            valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
          />
        </Card>
      </Col>

      {/* COMPLETED CARD - UBAH BACKGROUND INI */}
      <Col xs={6} sm={6} md={6} lg={6}>
        <Card style={{ 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #047857, #10b981)', // 🟢 WARNA COMPLETED
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }}>
          <Statistic
            title={<span style={{ color: 'white', fontSize: '12px', fontWeight: '500' }}>Completed</span>}
            value={completed}
            valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
            suffix={<CheckCircleOutlined style={{ color: 'white', opacity: 0.8 }} />}
          />
        </Card>
      </Col>

      {/* PENDING CARD - UBAH BACKGROUND INI */}
      <Col xs={6} sm={6} md={6} lg={6}>
        <Card style={{ 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #c2410c, #ea580c)', // 🟡 WARNA PENDING
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
        }}>
          <Statistic
            title={<span style={{ color: 'white', fontSize: '12px', fontWeight: '500' }}>Pending</span>}
            value={pending}
            valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
            suffix={<ClockCircleOutlined style={{ color: 'white', opacity: 0.8 }} />}
          />
        </Card>
      </Col>

      {/* URGENT CARD - UBAH BACKGROUND INI */}
      <Col xs={6} sm={6} md={6} lg={6}>
        <Card style={{ 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #dc2626, #ef4444)', // 🔴 WARNA URGENT
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        }}>
          <Statistic
            title={<span style={{ color: 'white', fontSize: '12px', fontWeight: '500' }}>Urgent</span>}
            value={highPriority}
            valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
            suffix={<RocketOutlined style={{ color: 'white', opacity: 0.8 }} />}
          />
        </Card>
      </Col>
    </Row>
  );
};

// TodoItem Component  
const TodoItem: React.FC<{
  todo: Todo;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}> = ({ todo, onEdit, onToggle, onDelete }) => {
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryLower = category?.toLowerCase() || '';
    switch (categoryLower) {
      case 'work': return <BugOutlined />;
      case 'personal': return <UserOutlined />;
      case 'shopping': return <ShoppingOutlined />;
      case 'health': return <HeartOutlined />;
      default: return <RocketOutlined />;
    }
  };

  return (
    <Card
      style={{
        marginBottom: '12px',
        opacity: todo.completed ? 0.8 : 1,
        backgroundColor: todo.completed ? '#f6f8fa' : 'white',
        border: `1px solid ${todo.completed ? '#d0d7de' : '#e1e4e8'}`,
        borderLeft: `4px solid ${
          todo.priority === 'high' ? '#EF4444' : 
          todo.priority === 'medium' ? '#F59E0B' : '#10B981'
        }`,
        transition: 'all 0.2s ease-in-out',
      }}
      bodyStyle={{ padding: '16px' }}
      hoverable
    >
      <Row align="top" gutter={12}>
        <Col flex="none">
          <Checkbox
            checked={todo.completed}
            onChange={onToggle}
            style={{ marginTop: '4px' }}
          />
        </Col>
        
        <Col flex="1">
          <div>
            {/* Title */}
            <Row align="middle" justify="space-between">
              <Col flex="1">
                <Text
                  strong
                  style={{
                    fontSize: '16px',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#6b7280' : '#111827'
                  }}
                >
                  {todo.title}
                </Text>
                {todo.completed && (
                  <CheckCircleOutlined 
                    style={{ 
                      marginLeft: '8px', 
                      color: '#10B981',
                      fontSize: '16px'
                    }} 
                  />
                )}
              </Col>
            </Row>

            {/* Description */}
            {todo.description && (
              <Paragraph
                style={{
                  fontSize: '14px',
                  color: todo.completed ? '#9ca3af' : '#6b7280',
                  marginTop: '8px',
                  marginBottom: '12px'
                }}
                ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
              >
                {todo.description}
              </Paragraph>
            )}

            {/* Meta Information */}
            <Row align="middle" justify="space-between">
              <Col>
                <Space size="small" wrap>
                  {/* Category */}
                  <Tag 
                    icon={getCategoryIcon(todo.category?.name)}
                    color="blue" 
                    style={{ borderRadius: '16px', fontSize: '12px' }}
                  >
                    {todo.category?.name}
                  </Tag>
                  
                  {/* Priority */}
                  <Tag 
                    color={getPriorityColor(todo.priority)} 
                    style={{ 
                      borderRadius: '16px',
                      textTransform: 'uppercase',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}
                  >
                    {todo.priority}
                  </Tag>
                  
                  {/* Created Date */}
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    <ClockCircleOutlined style={{ marginRight: '4px' }} />
                    {dayjs(todo.created_at).format('MMM D, YYYY')}
                  </Text>
                </Space>
              </Col>
              
              {/* Actions */}
              <Col>
                <Space>
                  <Tooltip title="Edit todo">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={onEdit}
                      style={{ color: '#3B82F6' }}
                    />
                  </Tooltip>
                  <Tooltip title="Delete todo">
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={onDelete}
                    />
                  </Tooltip>
                </Space>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

// TodoForm Component
const TodoForm: React.FC<{
  todo?: Todo | null;
  visible: boolean;
  onSave: (todoData: any) => void;
  onCancel: () => void;
}> = ({ todo, visible, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (todo) {
      form.setFieldsValue({
        title: todo.title,
        description: todo.description,
        category: todo.category,
        priority: todo.priority,
      });
    } else {
      form.resetFields();
    }
  }, [todo, form]);

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      onSave(values);
      form.resetFields();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PlusOutlined style={{ marginRight: '8px', color: '#3B82F6' }} />
          {todo ? 'Edit Todo' : 'Create New Todo'}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          priority: 'medium',
          category: 'Work'
        }}
      >
        <Form.Item
          name="title"
          label="Todo Title"
          rules={[
            { required: true, message: 'Please enter a title' },
            { max: 255, message: 'Title must be less than 255 characters' }
          ]}
        >
          <Input 
            placeholder="Enter todo title" 
            size="large" 
            maxLength={255}
            showCount
          />
        </Form.Item>

        <Form.Item 
          name="description" 
          label="Description"
        >
          <TextArea 
            placeholder="Enter description (optional)" 
            rows={4} 
            maxLength={1000}
            showCount
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item 
              name="category" 
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select size="large" placeholder="Select category">
                <Select.Option value="Work">
                  <Space>
                    <BugOutlined style={{ color: '#3B82F6' }} />
                    Work
                  </Space>
                </Select.Option>
                <Select.Option value="Personal">
                  <Space>
                    <UserOutlined style={{ color: '#10B981' }} />
                    Personal
                  </Space>
                </Select.Option>
                <Select.Option value="Shopping">
                  <Space>
                    <ShoppingOutlined style={{ color: '#F59E0B' }} />
                    Shopping
                  </Space>
                </Select.Option>
                <Select.Option value="Health">
                  <Space>
                    <HeartOutlined style={{ color: '#EF4444' }} />
                    Health
                  </Space>
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item 
              name="priority" 
              label="Priority"
              rules={[{ required: true, message: 'Please select priority' }]}
            >
              <Select size="large" placeholder="Select priority">
                <Select.Option value="low">
                  <Space>
                    🟢 <span>Low Priority</span>
                  </Space>
                </Select.Option>
                <Select.Option value="medium">
                  <Space>
                    🟡 <span>Medium Priority</span>
                  </Space>
                </Select.Option>
                <Select.Option value="high">
                  <Space>
                    🔴 <span>High Priority</span>
                  </Space>
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel} disabled={saving}>
              <CloseOutlined />
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={saving}
              icon={<SaveOutlined />}
            >
              {todo ? 'Update Todo' : 'Create Todo'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Main TodoApp Component
const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [filters, setFilters] = useState<TodoFilters>({});
  
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Load data from backend
  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading data from backend...');
      
      // Test backend connection
      const health = await api.getHealth();
      console.log('✅ Backend health:', health);
      setApiConnected(true);

      // Load todos
      const todosResponse = await api.getTodos();
      console.log('📋 Todos response:', todosResponse);
      setTodos(todosResponse.data as Todo[]);

      // Load categories (for future use)
      const categoriesResponse = await api.getCategories();
      console.log('📁 Categories loaded:', categoriesResponse.data.length, 'categories');

      message.success('✅ Data loaded from backend API!');
    } catch (error: any) {
      console.error('❌ API Connection Error:', error);
      setApiConnected(false);
      
      if (error.code === 'ERR_NETWORK') {
        message.error('🚫 Backend server is not running. Please start backend first.');
      } else {
        message.error('⚠️ Failed to connect to backend. Using demo data.');
      }
      
      // Fallback demo data
      setTodos([
        {
          id: 1,
          title: '🎉 Frontend Setup Complete!',
          description: 'React + TypeScript + Ant Design successfully integrated with professional UI design',
          completed: true,
          category_id: 1,
          category: { id: 1, name: 'Work', color: '#3B82F6' },
          priority: 'high',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          title: '🔗 Backend API Integration',
          description: 'Test connection between frontend React app and backend Express server',
          completed: false,
          category_id: 1,
          category: { id: 1, name: 'Work', color: '#3B82F6' },
          priority: 'high',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          title: '📱 Responsive Design Testing',
          description: 'Test UI responsiveness on mobile, tablet, and desktop devices',
          completed: false,
          category_id: 1,
          category: { id: 1, name: 'Work', color: '#3B82F6' },
          priority: 'medium',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          title: '🛒 Weekly grocery shopping',
          description: 'Buy milk, bread, eggs, fruits, vegetables, and cleaning supplies',
          completed: false,
          category_id: 3,
          category: { id: 3, name: 'Shopping', color: '#F59E0B' },
          priority: 'low',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 5,
          title: '💪 Morning workout routine',
          description: 'Gym session focusing on cardio and strength training',
          completed: false,
          category_id: 4,
          category: { id: 4, name: 'Health', color: '#EF4444' },
          priority: 'medium',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    if (filters.search && !todo.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !todo.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && todo.category?.name !== filters.category) return false;
    if (filters.priority && todo.priority !== filters.priority) return false;
    if (filters.completed !== undefined && todo.completed !== filters.completed) return false;
    return true;
  });

  const handleRefresh = () => {
    loadData();
  };

  const handleToggleComplete = async (todo: Todo) => {
    if (!apiConnected) {
      // Fallback to local state if API not connected
      setTodos(prev => prev.map(t => 
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      ));
      message.success(`✅ Todo marked as ${!todo.completed ? 'completed' : 'pending'} (local only)`);
      return;
    }

    try {
      const newStatus = !todo.completed;
      await api.toggleTodo(todo.id, newStatus);
      console.log('✅ Todo toggled via API');
      
      // Refresh data from backend
      await loadData();
      message.success(`✅ Todo marked as ${newStatus ? 'completed' : 'pending'}!`);
    } catch (error: any) {
      console.error('❌ Error toggling todo:', error);
      message.error('Failed to update todo status. Please try again.');
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    Modal.confirm({
      title: 'Delete Todo',
      content: 'Are you sure you want to delete this todo? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      icon: <DeleteOutlined style={{ color: '#ef4444' }} />,
      onOk: async () => {
        if (!apiConnected) {
          // Fallback to local state if API not connected
          setTodos(prev => prev.filter(t => t.id !== todoId));
          message.success('🗑️ Todo deleted successfully (local only)');
          return;
        }

        try {
          await api.deleteTodo(todoId);
          console.log('✅ Todo deleted via API');
          
          // Refresh data from backend
          await loadData();
          message.success('🗑️ Todo deleted successfully!');
        } catch (error: any) {
          console.error('❌ Error deleting todo:', error);
          message.error('Failed to delete todo. Please try again.');
        }
      }
    });
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowTodoForm(true);
  };

  const handleSaveTodo = async (todoData: any) => {
    if (!apiConnected) {
      // Fallback to local state if API not connected
      if (editingTodo) {
        setTodos(prev => prev.map(t => 
          t.id === editingTodo.id ? { 
            ...t, 
            ...todoData,
            id: editingTodo.id,
            completed: editingTodo.completed,
            created_at: editingTodo.created_at
          } : t
        ));
        message.success('📝 Todo updated successfully (local only)');
      } else {
        const newTodo: Todo = {
          id: Math.max(...todos.map(t => t.id), 0) + 1,
          title: todoData.title,
          description: todoData.description,
          completed: false,
          category_id: 1,
          category: { id: 1, name: todoData.category, color: '#3B82F6' },
          priority: todoData.priority,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setTodos(prev => [newTodo, ...prev]);
        message.success('🎉 Todo created successfully (local only)');
      }
      
      setShowTodoForm(false);
      setEditingTodo(null);
      return;
    }

    try {
      if (editingTodo) {
        // Update existing todo via API
        const response = await api.updateTodo(editingTodo.id, todoData);
        console.log('✅ Todo updated:', response);
        
        // Refresh data from backend
        await loadData();
        message.success('📝 Todo updated successfully!');
      } else {
        // Create new todo via API
        // Map category name to category_id
        const categoryMap: { [key: string]: number } = {
          'Work': 1,
          'Personal': 2,
          'Shopping': 3,
          'Health': 4
        };
        
        const apiTodoData = {
          title: todoData.title,
          description: todoData.description,
          category_id: categoryMap[todoData.category] || 1,
          priority: todoData.priority
        };
        
        const response = await api.createTodo(apiTodoData);
        console.log('✅ Todo created:', response);
        
        // Refresh data from backend
        await loadData();
        message.success('🎉 Todo created successfully!');
      }
    } catch (error: any) {
      console.error('❌ Error saving todo:', error);
      message.error('Failed to save todo. Please try again.');
      return;
    }
    
    setShowTodoForm(false);
    setEditingTodo(null);
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value || undefined }));
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Row justify="space-between" align="middle" style={{ height: '100%' }}>
          <Col>
            <Title level={3} style={{ color: '#1e40af', margin: 0 }}>
              <RocketOutlined style={{ marginRight: '8px' }} />
              Industrix Todo
            </Title>
          </Col>
          <Col>
            <Space wrap>
              <Badge 
                status={apiConnected ? 'success' : 'error'} 
                text={
                  <Text style={{ fontSize: '12px', fontWeight: '500' }}>
                    {apiConnected ? 'Backend Connected' : 'Backend Offline'}
                  </Text>
                }
              />
              <Button
                type="default"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
                size="middle"
              >
                <span style={{ display: window.innerWidth > 576 ? 'inline' : 'none' }}>
                  Refresh
                </span>
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowTodoForm(true)}
                size="middle"
              >
                <span style={{ display: window.innerWidth > 576 ? 'inline' : 'none' }}>
                  Add Todo
                </span>
              </Button>
            </Space>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: '16px 16px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* API Connection Status */}
          {!apiConnected && (
            <Alert
              message="🔗 Backend API Connection"
              description={
                <div>
                  <Text>Backend server appears to be offline. Ensure the backend is running on </Text>
                  <Text code>{API_BASE_URL}</Text>
                  <br />
                  <Text strong style={{ color: '#059669' }}>Currently showing demo data for demonstration.</Text>
                </div>
              }
              type="warning"
              showIcon
              style={{ marginBottom: '24px' }}
              action={
                <Button size="small" onClick={handleRefresh} loading={loading}>
                  Retry Connection
                </Button>
              }
            />
          )}

          {/* Search and Filter Bar */}
          <Card style={{ marginBottom: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={16} md={18} lg={20}>
                <Search
                  placeholder="🔍 Search todos by title or description..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  onSearch={handleSearch}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={8} md={6} lg={4}>
                <Button
                  type="default"
                  icon={<FilterOutlined />}
                  onClick={() => setShowFilters(true)}
                  style={{ width: '100%' }}
                  size="large"
                >
                  <span style={{ display: window.innerWidth > 576 ? 'inline' : 'none' }}>
                    Advanced Filters
                  </span>
                  <span style={{ display: window.innerWidth <= 576 ? 'inline' : 'none' }}>
                    Filter
                  </span>
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Statistics */}
          <TodoStats todos={filteredTodos} />

          {/* Todo List */}
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  📋 Todos ({filteredTodos.length})
                  {apiConnected && <Tag color="green" style={{ marginLeft: '8px' }}>Live Data</Tag>}
                  {!apiConnected && <Tag color="orange" style={{ marginLeft: '8px' }}>Demo Data</Tag>}
                </span>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefresh}
                  type="text"
                  size="small"
                  loading={loading}
                >
                  Refresh
                </Button>
              </div>
            }
            style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
          >
            {loading && todos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>
                  <Text type="secondary">Loading todos from backend...</Text>
                </div>
              </div>
            ) : filteredTodos.length === 0 ? (
              <Empty 
                description="No todos found" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setShowTodoForm(true)}
                >
                  Create Your First Todo
                </Button>
              </Empty>
            ) : (
              <List
                dataSource={filteredTodos}
                renderItem={(todo) => (
                  <List.Item key={todo.id} style={{ padding: 0 }}>
                    <TodoItem
                      todo={todo}
                      onEdit={() => handleEditTodo(todo)}
                      onToggle={() => handleToggleComplete(todo)}
                      onDelete={() => handleDeleteTodo(todo.id)}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </div>
      </Content>

      {/* Todo Form Modal */}
      <TodoForm
        todo={editingTodo}
        visible={showTodoForm}
        onSave={handleSaveTodo}
        onCancel={() => {
          setShowTodoForm(false);
          setEditingTodo(null);
        }}
      />

      {/* Filters Drawer */}
      <Drawer
        title="🔧 Advanced Filters"
        placement="right"
        onClose={() => setShowFilters(false)}
        open={showFilters}
        width={Math.min(400, typeof window !== 'undefined' ? window.innerWidth * 0.9 : 400)}
      >
        <Form layout="vertical">
          <Form.Item label="Category">
            <Select 
              placeholder="Filter by category" 
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              value={filters.category}
            >
              <Select.Option value="Work">🏢 Work</Select.Option>
              <Select.Option value="Personal">👤 Personal</Select.Option>
              <Select.Option value="Shopping">🛒 Shopping</Select.Option>
              <Select.Option value="Health">❤️ Health</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Priority">
            <Select 
              placeholder="Filter by priority" 
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
              value={filters.priority}
            >
              <Select.Option value="low">🟢 Low</Select.Option>
              <Select.Option value="medium">🟡 Medium</Select.Option>
              <Select.Option value="high">🔴 High</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Status">
            <Select 
              placeholder="Filter by status" 
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, completed: value }))}
              value={filters.completed}
            >
              <Select.Option value={false}>📝 Pending</Select.Option>
              <Select.Option value={true}>✅ Completed</Select.Option>
            </Select>
          </Form.Item>

          <Divider />

          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              icon={<ClearOutlined />}
              onClick={() => {
                setFilters({});
                setShowFilters(false);
                message.success('🧹 Filters cleared');
              }}
              block
            >
              Clear All Filters
            </Button>
            <Button 
              type="primary"
              onClick={() => setShowFilters(false)}
              block
            >
              Apply Filters
            </Button>
          </Space>
        </Form>
      </Drawer>
    </Layout>
  );
};

export default TodoApp;