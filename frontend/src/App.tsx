// frontend/src/App.tsx
import React from 'react';
import { ConfigProvider } from 'antd';
import TodoApp from './components/TodoApp';
import './App.css';

const theme = {
  token: {
    colorPrimary: '#3B82F6',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    borderRadius: 8,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f8fafc',
      headerColor: '#1f2937'
    },
    Card: {
      borderRadius: 12,
      boxShadowTertiary: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    Button: {
      borderRadius: 8
    }
  }
};

const App: React.FC = () => {
  return (
    <ConfigProvider theme={theme}>
      <div className="App">
        <TodoApp />
      </div>
    </ConfigProvider>
  );
};

export default App;