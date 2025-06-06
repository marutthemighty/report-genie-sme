
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface UserSettings {
  theme: string;
  notification_email: boolean;
  notification_push: boolean;
  export_formats: {
    pdf: boolean;
    csv: boolean;
    googleSlides: boolean;
  };
  privacy_settings: {
    dataExportEnabled: boolean;
    consentPreferencesSet: boolean;
    privacySettingsConfigured: boolean;
    analytics: boolean;
    storage: boolean;
    marketing: boolean;
  };
  connected_integrations: Array<{
    id: string;
    name: string;
    status: string;
    apiKey: string;
    lastSync: string;
  }>;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  notification_email: true,
  notification_push: false,
  export_formats: {
    pdf: true,
    csv: true,
    googleSlides: false
  },
  privacy_settings: {
    dataExportEnabled: true,
    consentPreferencesSet: false,
    privacySettingsConfigured: false,
    analytics: false,
    storage: false,
    marketing: false
  },
  connected_integrations: []
};

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSettings({
          theme: data.theme || defaultSettings.theme,
          notification_email: data.notification_email ?? defaultSettings.notification_email,
          notification_push: data.notification_push ?? defaultSettings.notification_push,
          export_formats: data.export_formats || defaultSettings.export_formats,
          privacy_settings: data.privacy_settings || defaultSettings.privacy_settings,
          connected_integrations: data.connected_integrations || defaultSettings.connected_integrations
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          theme: updatedSettings.theme,
          notification_email: updatedSettings.notification_email,
          notification_push: updatedSettings.notification_push,
          export_formats: updatedSettings.export_formats,
          privacy_settings: updatedSettings.privacy_settings,
          connected_integrations: updatedSettings.connected_integrations,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving settings:', error);
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return {
    settings,
    loading,
    saveSettings,
    updateExportFormats: (formats: Partial<UserSettings['export_formats']>) => {
      saveSettings({
        export_formats: { ...settings.export_formats, ...formats }
      });
    },
    updateNotifications: (notifications: { email?: boolean; push?: boolean }) => {
      saveSettings({
        notification_email: notifications.email ?? settings.notification_email,
        notification_push: notifications.push ?? settings.notification_push
      });
    },
    updatePrivacySettings: (privacy: Partial<UserSettings['privacy_settings']>) => {
      saveSettings({
        privacy_settings: { ...settings.privacy_settings, ...privacy }
      });
    },
    updateConnectedIntegrations: (integrations: UserSettings['connected_integrations']) => {
      saveSettings({
        connected_integrations: integrations
      });
    }
  };
};
