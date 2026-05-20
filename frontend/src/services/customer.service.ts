import api from './api';

export const customerService = {
  getAll: async (page: number = 1, size: number = 10, q?: string) => {
    const response = await api.get('customers/', { params: { page, size, q } });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('customers/me');
    return response.data;
  },

  updateMe: async (data: any) => {
    const response = await api.put('customers/me', data);
    return response.data;
  },

  getCustomerById: async (id: number) => {
    const response = await api.get(`customers/${id}`);
    return response.data;
  },

  createCustomer: async (data: any) => {
    const response = await api.post('customers/', data);
    return response.data;
  },

  updateCustomer: async (id: number, data: any) => {
    const response = await api.put(`customers/${id}`, data);
    return response.data;
  },

  deleteCustomer: async (id: number) => {
    const response = await api.delete(`customers/${id}`);
    return response.data;
  },
};
