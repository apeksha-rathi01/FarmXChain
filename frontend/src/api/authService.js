import api from "./axios";
import { jwtDecode } from 'jwt-decode';

class AuthService {
  // User Registration
  async register(userData) {
    try {
      console.log('Registering user:', userData);
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error.response?.data?.message || error.message;
    }
  }

  // User Login
  async login(email, password) {
    try {
      console.log('Logging in user:', email);
      const response = await api.post('/auth/login', { email, password });

      const { token, userId, name, email: userEmail, role } = response.data;

      const user = {
        id: userId,
        name,
        email: userEmail,
        role
      };

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data?.message || error.message;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        return {
          id: decoded.userId || decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Get current user profile
  async getProfile() {
    return api.get('/auth/profile');
  }

  // Update user profile
  async updateProfile(profileData) {
    return api.put('/auth/profile', profileData);
  }

  // Refresh JWT token
  async refreshToken() {
    return api.post('/auth/refresh');
  }

  // Get all users (Admin only)
  async getAllUsers() {
    return api.get('/users');
  }

  // Get user by ID
  async getUserById(id) {
    return api.get(`/users/${id}`);
  }
}

const authService = new AuthService();
export default authService;
