import api from './api';

export const supplierService = {
  getAll: async () => {
    const response = await api.get('suppliers/');
    return response.data;
  },

  getSupplierById: async (id: number) => {
    const response = await api.get(`suppliers/${id}`);
    return response.data;
  },

  createSupplier: async (data: any) => {
    const response = await api.post('suppliers/', data);
    return response.data;
  },

  updateSupplier: async (id: number, data: any) => {
    const response = await api.put(`suppliers/${id}`, data);
    return response.data;
  },

  deleteSupplier: async (id: number) => {
    const response = await api.delete(`suppliers/${id}`);
    return response.data;
  },

  getBookings: async (id: number) => {
    const response = await api.get(`suppliers/${id}/bookings`);
    return response.data;
  },
};
