import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Posts from './components/Posts';
import ProtectedRoute from './components/ProtectedRoute';
import apiService from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      setIsAuthenticated(apiService.isAuthenticated());
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>JWT Authentication Demo</h1>
      </header>
      
      <main>
        <ProtectedRoute 
          fallback={<Login onLogin={handleLogin} />}
        >
          <Posts onLogout={handleLogout} />
        </ProtectedRoute>
      </main>
    </div>
  );
}

export default App;