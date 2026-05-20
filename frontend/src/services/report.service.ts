import apiClient from './api';

export const reportService = {
  getDashboardStats: async (params: any = {}) => {
    const response = await apiClient.get('reports/dashboard-stats', { params });
    return response.data;
  },
  getRevenueChart: async (params: any = {}) => {
    const response = await apiClient.get('reports/charts/revenue', { params });
    return response.data;
  },
  getOrdersChart: async (params: any = {}) => {
    const response = await apiClient.get('reports/charts/orders', { params });
    return response.data;
  },
  getCategoryDistribution: async (params: any = {}) => {
    const response = await apiClient.get('reports/charts/categories', { params });
    return response.data;
  },
  getFeaturedTours: async (params: any = {}) => {
    const response = await apiClient.get('reports/featured-tours', { params });
    return response.data;
  }
};
