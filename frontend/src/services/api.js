import axios from 'axios';

const AUTH_BASE_URL = 'http://localhost:4000';
const API_BASE_URL = 'http://localhost:3000';

class ApiService {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    
    // Set up axios interceptor to add auth header
    axios.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Set up response interceptor to handle token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(username) {
    try {
      const response = await axios.post(`${AUTH_BASE_URL}/login`, { username });
      const { accessToken, refreshToken } = response.data;
      
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async refreshAccessToken() {
    try {
      const response = await axios.post(`${AUTH_BASE_URL}/token`, {
        token: this.refreshToken
      });
      
      const { accessToken } = response.data;
      this.accessToken = accessToken;
      localStorage.setItem('accessToken', accessToken);
      
      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      if (this.refreshToken) {
        await axios.delete(`${AUTH_BASE_URL}/logout`, {
          data: { token: this.refreshToken }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
    }
  }

  async getPosts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  getUsername() {
    return localStorage.getItem('username');
  }
}

export default new ApiService();