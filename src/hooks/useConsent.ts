
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ConsentState {
  analytics: boolean;
  storage: boolean;
  marketing: boolean;
}

export const useConsent = () => {
  const [consents, setConsents] = useState<ConsentState>({
    analytics: false,
    storage: false,
    marketing: false
  });
  const [hasShownModal, setHasShownModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadConsents = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Load from database for authenticated users
          const { data } = await supabase
            .from('user_consents')
            .select('consent_type, granted')
            .eq('user_id', user.id);

          if (data && data.length > 0) {
            const consentMap = data.reduce((acc, consent) => {
              acc[consent.consent_type as keyof ConsentState] = consent.granted;
              return acc;
            }, {} as Partial<ConsentState>);

            setConsents(prev => ({ ...prev, ...consentMap }));
            setHasShownModal(true);
          } else {
            // No consents found, show modal
            setHasShownModal(false);
          }
        } else {
          // Load from localStorage for non-authenticated users
          const savedConsent = localStorage.getItem('gdpr_consent');
          const savedModalShown = localStorage.getItem('gdpr_modal_shown');
          
          if (savedConsent) {
            const parsed = JSON.parse(savedConsent);
            setConsents(parsed);
          }
          
          if (savedModalShown) {
            setHasShownModal(JSON.parse(savedModalShown));
          }
        }
      } catch (error) {
        console.error('Error loading consents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConsents();
  }, [user]);

  const saveConsents = async (newConsents: ConsentState) => {
    try {
      setConsents(newConsents);
      setHasShownModal(true);

      if (user) {
        // Save to database for authenticated users
        const consentEntries = Object.entries(newConsents).map(([type, granted]) => ({
          user_id: user.id,
          consent_type: type,
          granted,
          granted_at: granted ? new Date().toISOString() : null,
          ip_address: null,
          user_agent: navigator.userAgent
        }));

        // Upsert consents
        for (const consent of consentEntries) {
          await supabase
            .from('user_consents')
            .upsert(consent, { 
              onConflict: 'user_id,consent_type'
            });
        }
      } else {
        // Save to localStorage for non-authenticated users
        localStorage.setItem('gdpr_consent', JSON.stringify(newConsents));
        localStorage.setItem('gdpr_modal_shown', 'true');
      }
    } catch (error) {
      console.error('Error saving consents:', error);
      throw error;
    }
  };

  return {
    consents,
    hasShownModal,
    isLoading,
    saveConsents
  };
};
