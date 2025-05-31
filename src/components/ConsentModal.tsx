
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, MapPin } from 'lucide-react';
import { useConsent } from '@/hooks/useConsent';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsentModal = ({ isOpen, onClose }: ConsentModalProps) => {
  const { consents, saveConsents } = useConsent();
  const [tempConsents, setTempConsents] = useState(consents);

  const handleConsentChange = (type: keyof typeof tempConsents, checked: boolean) => {
    setTempConsents(prev => ({ ...prev, [type]: checked }));
  };

  const handleSave = async () => {
    await saveConsents(tempConsents);
    onClose();
  };

  const handleDeclineAll = async () => {
    const declinedConsents = {
      analytics: false,
      storage: false,
      marketing: false
    };
    await saveConsents(declinedConsents);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Privacy Preferences
          </DialogTitle>
          <DialogDescription>
            We respect your privacy. Please choose which data processing activities you consent to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>GDPR/CCPA compliance notice</span>
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
            <Button variant="outline" onClick={handleDeclineAll} className="flex-1">
              Decline All
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Preferences
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentModal;
