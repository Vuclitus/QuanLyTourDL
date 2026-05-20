import api from './api';

export const orderService = {
  getAll: async () => {
    const response = await api.get('orders/');
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('orders/my-orders');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`orders/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('orders/', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`orders/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`orders/${id}`);
    return response.data;
  },

  pay: async (id: number) => {
    const response = await api.post(`orders/${id}/pay`);
    return response.data;
  },
};
