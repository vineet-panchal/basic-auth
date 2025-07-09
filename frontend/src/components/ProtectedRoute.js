import React from 'react';
import apiService from '../services/api';

const ProtectedRoute = ({ children, fallback }) => {
  const isAuthenticated = apiService.isAuthenticated();
  
  return isAuthenticated ? children : fallback;
};

export default ProtectedRoute;