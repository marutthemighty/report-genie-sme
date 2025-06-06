
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, MapPin, AlertTriangle } from 'lucide-react';
import { useConsent } from '@/hooks/useConsent';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsentModal = ({ isOpen, onClose }: ConsentModalProps) => {
  const { consents, saveConsents } = useConsent();
  const [tempConsents, setTempConsents] = useState(consents);
  const [isEUOrCA, setIsEUOrCA] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTempConsents(consents);
  }, [consents]);

  useEffect(() => {
    // Detect user location based on timezone and other indicators
    const detectLocation = async () => {
      try {
        // Simple timezone-based detection
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isEuropean = timezone.includes('Europe/') || 
                          timezone.includes('Brussels') || 
                          timezone.includes('Paris') ||
                          timezone.includes('Berlin') ||
                          timezone.includes('Rome') ||
                          timezone.includes('Madrid');
        
        const isCalifornia = timezone.includes('America/Los_Angeles') || 
                            timezone.includes('America/Pacific');

        if (isEuropean) {
          setIsEUOrCA(true);
          setUserLocation('EU');
        } else if (isCalifornia) {
          setIsEUOrCA(true);
          setUserLocation('California');
        }

        // Try to get more accurate location via IP geolocation API (optional)
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          if (data.country_code) {
            const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
            
            if (euCountries.includes(data.country_code)) {
              setIsEUOrCA(true);
              setUserLocation('EU');
            } else if (data.country_code === 'US' && data.region_code === 'CA') {
              setIsEUOrCA(true);
              setUserLocation('California');
            }
          }
        } catch (ipError) {
          console.log('IP detection failed, using timezone detection');
        }
      } catch (error) {
        console.error('Location detection failed:', error);
      }
    };

    if (isOpen) {
      detectLocation();
    }
  }, [isOpen]);

  const handleConsentChange = (type: keyof typeof tempConsents, checked: boolean) => {
    setTempConsents(prev => ({ ...prev, [type]: checked }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveConsents(tempConsents);
      onClose();
    } catch (error) {
      console.error('Failed to save consents:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeclineAll = async () => {
    if (isEUOrCA) {
      // For EU/CA users, show warning about declined consent
      const confirmed = window.confirm(
        `As a ${userLocation} user, declining all cookies may limit some features. Are you sure you want to decline all non-essential cookies?`
      );
      if (!confirmed) return;
    }

    setIsSaving(true);
    try {
      const declinedConsents = {
        analytics: false,
        storage: false,
        marketing: false
      };
      await saveConsents(declinedConsents);
      onClose();
    } catch (error) {
      console.error('Failed to save consents:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // For EU/CA users, make the modal non-dismissible
  const handleModalClose = () => {
    if (isEUOrCA) {
      // Don't allow closing without making a choice
      return;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => isEUOrCA && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Privacy Preferences
            {isEUOrCA && <AlertTriangle className="w-4 h-4 text-amber-500" />}
          </DialogTitle>
          <DialogDescription>
            We respect your privacy. Please choose which data processing activities you consent to.
            {isEUOrCA && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm">
                <strong>GDPR/CCPA Notice:</strong> As a {userLocation} user, your privacy choices are required by law.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>
              {userLocation ? `Detected location: ${userLocation}` : 'GDPR/CCPA compliance notice'}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="analytics"
                checked={tempConsents.analytics}
                onCheckedChange={(checked) => handleConsentChange('analytics', checked as boolean)}
              />
              <div className="space-y-1">
                <label htmlFor="analytics" className="text-sm font-medium cursor-pointer">
                  Analytics & Performance
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Help us understand how you use our service to improve performance and user experience.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="storage"
                checked={tempConsents.storage}
                onCheckedChange={(checked) => handleConsentChange('storage', checked as boolean)}
              />
              <div className="space-y-1">
                <label htmlFor="storage" className="text-sm font-medium cursor-pointer">
                  Data Storage
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Store your reports, settings, and preferences to provide a personalized experience.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="marketing"
                checked={tempConsents.marketing}
                onCheckedChange={(checked) => handleConsentChange('marketing', checked as boolean)}
              />
              <div className="space-y-1">
                <label htmlFor="marketing" className="text-sm font-medium cursor-pointer">
                  Marketing Communications
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive updates about new features, tips, and relevant content via email.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleDeclineAll} 
              className="flex-1"
              disabled={isSaving}
            >
              {isEUOrCA ? 'Decline Non-Essential' : 'Decline All'}
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : (isEUOrCA ? 'Confirm Choices' : 'Save Preferences')}
            </Button>
          </div>

          {isEUOrCA && (
            <p className="text-xs text-gray-500 text-center">
              You must make a privacy choice to continue using our service.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentModal;
