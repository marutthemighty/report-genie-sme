
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export interface ExportFormats {
  pdf: boolean;
  csv: boolean;
  googleSlides: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
}

export interface PrivacySettings {
  dataExportEnabled: boolean;
  privacySettingsConfigured: boolean;
  consentPreferencesSet: boolean;
  lastDataExport?: string;
}

interface UserSettingsState {
  exportFormats: ExportFormats;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  connectedIntegrations: Array<{
    id: string;
    name: string;
    status: 'connected' | 'disconnected';
    lastSync: string;
    apiKey: string;
    connectionData?: any;
  }>;
  setExportFormats: (formats: ExportFormats) => void;
  setNotifications: (notifications: NotificationSettings) => void;
  setPrivacySettings: (privacy: PrivacySettings) => void;
  addIntegration: (integration: any) => void;
  removeIntegration: (id: string) => void;
  syncIntegration: (id: string) => void;
  saveToDatabase: () => Promise<void>;
  loadFromDatabase: () => Promise<void>;
}

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set, get) => ({
      exportFormats: {
        pdf: true,
        csv: true,
        googleSlides: false,
      },
      notifications: {
        email: true,
        push: false,
      },
      privacy: {
        dataExportEnabled: true,
        privacySettingsConfigured: false,
        consentPreferencesSet: false,
      },
      connectedIntegrations: [],
      
      setExportFormats: (formats) => {
        set({ exportFormats: formats });
        get().saveToDatabase();
      },
      
      setNotifications: (notifications) => {
        set({ notifications });
        get().saveToDatabase();
      },
      
      setPrivacySettings: (privacy) => {
        set({ privacy });
        get().saveToDatabase();
      },
      
      addIntegration: (integration) => {
        set(state => ({
          connectedIntegrations: [...state.connectedIntegrations, integration]
        }));
        get().saveToDatabase();
      },
      
      removeIntegration: (id) => {
        set(state => ({
          connectedIntegrations: state.connectedIntegrations.filter(int => int.id !== id)
        }));
        get().saveToDatabase();
      },
      
      syncIntegration: (id) => {
        set(state => ({
          connectedIntegrations: state.connectedIntegrations.map(int =>
            int.id === id ? { ...int, lastSync: 'Just now' } : int
          )
        }));
        get().saveToDatabase();
      },
      
      saveToDatabase: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const settings = get();
          await supabase
            .from('user_settings')
            .upsert({
              user_id: user.id,
              theme: 'system', // Keep existing theme logic
              notification_email: settings.notifications.email,
              notification_push: settings.notifications.push,
              export_formats: settings.exportFormats,
              privacy_settings: settings.privacy,
              connected_integrations: settings.connectedIntegrations,
              updated_at: new Date().toISOString(),
            });
        } catch (error) {
          console.error('Failed to save settings:', error);
        }
      },
      
      loadFromDatabase: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const { data } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (data) {
            set({
              notifications: {
                email: data.notification_email ?? true,
                push: data.notification_push ?? false,
              },
              exportFormats: (data.export_formats as ExportFormats) || {
                pdf: true,
                csv: true,
                googleSlides: false,
              },
              privacy: (data.privacy_settings as PrivacySettings) || {
                dataExportEnabled: true,
                privacySettingsConfigured: false,
                consentPreferencesSet: false,
              },
              connectedIntegrations: (data.connected_integrations as any[]) || [],
            });
          }
        } catch (error) {
          console.error('Failed to load settings:', error);
        }
      },
    }),
    {
      name: 'user-settings-storage',
    }
  )
);
