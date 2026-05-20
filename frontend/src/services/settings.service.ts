import api from './api';

export interface SystemSettings {
  site_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  logo_url: string | null;
  timezone: string;
  default_language: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string | null;
  smtp_password: string | null;
  default_payment_gateway: string;
  vnpay_config: {
    tmn_code: string;
    hash_secret: string;
    is_sandbox: boolean;
  };
}

export const settingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    const response = await api.get('settings/');
    return response.data;
  },

  updateSettings: async (settingsData: Partial<SystemSettings>): Promise<SystemSettings> => {
    const response = await api.put('settings/', settingsData);
    return response.data;
  },

  uploadLogo: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('uploads/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
