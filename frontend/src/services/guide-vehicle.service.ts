import api from './api';

export const guideVehicleService = {
  // Guides
  getGuides: async () => {
    const response = await api.get('guides-vehicles/guides');
    return response.data;
  },

  getGuideById: async (id: number) => {
    const response = await api.get(`guides-vehicles/guides/${id}`);
    return response.data;
  },

  createGuide: async (data: any) => {
    const response = await api.post('guides-vehicles/guides', data);
    return response.data;
  },

  updateGuide: async (id: number, data: any) => {
    const response = await api.put(`guides-vehicles/guides/${id}`, data);
    return response.data;
  },

  deleteGuide: async (id: number) => {
    const response = await api.delete(`guides-vehicles/guides/${id}`);
    return response.data;
  },

  getGuideTours: async (id: number) => {
    const response = await api.get(`guides-vehicles/guides/${id}/tours`);
    return response.data;
  },

  getGuideReviews: async (id: number) => {
    const response = await api.get(`guides-vehicles/guides/${id}/reviews`);
    return response.data;
  },

  // Vehicles
  getVehicles: async () => {
    const response = await api.get('guides-vehicles/vehicles');
    return response.data;
  },

  getVehicleById: async (id: number) => {
    const response = await api.get(`guides-vehicles/vehicles/${id}`);
    return response.data;
  },

  getVehicleTours: async (id: number) => {
    const response = await api.get(`guides-vehicles/vehicles/${id}/tours`);
    return response.data;
  },

  createVehicle: async (data: any) => {
    const response = await api.post('guides-vehicles/vehicles', data);
    return response.data;
  },

  updateVehicle: async (id: number, data: any) => {
    const response = await api.put(`guides-vehicles/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: number) => {
    const response = await api.delete(`guides-vehicles/vehicles/${id}`);
    return response.data;
  },
};
