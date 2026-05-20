import api from './api';

export const employeeService = {
  getAll: async () => {
    const response = await api.get('employees/');
    return response.data;
  },

  getEmployeeById: async (id: number) => {
    const response = await api.get(`employees/${id}`);
    return response.data;
  },

  createEmployee: async (data: any) => {
    const response = await api.post('employees/', data);
    return response.data;
  },

  updateEmployee: async (id: number, data: any) => {
    const response = await api.put(`employees/${id}`, data);
    return response.data;
  },

  deleteEmployee: async (id: number) => {
    const response = await api.delete(`employees/${id}`);
    return response.data;
  },
};
