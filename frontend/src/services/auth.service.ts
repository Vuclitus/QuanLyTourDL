import api from './api';

export const authService = {
  login: async (credentials: any) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post('auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('isLoggedIn', 'true');
    }
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
  },

  getCurrentUser: async () => {
    const response = await api.get('auth/me');
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await api.put('auth/me', userData);
    return response.data;
  },
};
