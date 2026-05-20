import api from './api';

export const tourService = {
  getAll: async (params?: any) => {
    const response = await api.get('tours/', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`tours/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('tours/', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`tours/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`tours/${id}`);
    return response.data;
  },
};
