
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, MapPin } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsentModal = ({ isOpen, onClose }: ConsentModalProps) => {
  const [consents, setConsents] = useState({
    analytics: false,
    storage: false,
    marketing: false
  });

  const handleConsentChange = (type: keyof typeof consents, checked: boolean) => {
    setConsents(prev => ({ ...prev, [type]: checked }));
  };

  const handleSave = () => {
    // Here you would typically send the consent data to your backend
    console.log('Saving consents:', consents);
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
            <span>Detected location: California, USA (CCPA applies)</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="analytics"
                checked={consents.analytics}
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
                checked={consents.storage}
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
                checked={consents.marketing}
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
            <Button variant="outline" onClick={onClose} className="flex-1">
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
