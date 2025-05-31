
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
  const { user } = useAuth();

  useEffect(() => {
    // Check if user has already given consent
    const checkExistingConsent = async () => {
      if (user) {
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
        }
      } else {
        // For non-authenticated users, check localStorage
        const savedConsent = localStorage.getItem('gdpr_consent');
        if (savedConsent) {
          const parsed = JSON.parse(savedConsent);
          setConsents(parsed);
          setHasShownModal(true);
        }
      }
    };

    checkExistingConsent();
  }, [user]);

  const saveConsents = async (newConsents: ConsentState) => {
    setConsents(newConsents);
    setHasShownModal(true);

    if (user) {
      // Save to database for authenticated users
      const consentEntries = Object.entries(newConsents).map(([type, granted]) => ({
        user_id: user.id,
        consent_type: type,
        granted,
        granted_at: granted ? new Date().toISOString() : null,
        ip_address: null, // Could be populated from IP detection service
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
    }
  };

  return {
    consents,
    hasShownModal,
    saveConsents
  };
};
