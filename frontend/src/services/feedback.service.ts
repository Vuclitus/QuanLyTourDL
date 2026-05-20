import api from './api';

export const feedbackService = {
  getAll: async (tourId?: number, guideId?: number) => {
    const response = await api.get('feedbacks/', { params: { tour_id: tourId, guide_id: guideId } });
    return response.data;
  },

  submit: async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const response = await api.post('feedbacks', data);
    return response.data;
  }
};
