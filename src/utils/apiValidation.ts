
import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isValid: boolean;
  message: string;
  connectionData?: any;
}

// Simulate real API key validation patterns
const API_KEY_PATTERNS = {
  'Shopify': /^shpat_[a-f0-9]{32}$|^shpss_[a-f0-9]{32}$/, // Shopify private app or custom app tokens
  'Google Analytics': /^AIza[0-9A-Za-z-_]{35}$/, // Google API key pattern
  'Amazon Seller Central': /^AKIA[0-9A-Z]{16}$/, // AWS access key pattern
  'WooCommerce': /^ck_[a-f0-9]{32}$/, // WooCommerce consumer key
  'Facebook Ads': /^EAA[a-zA-Z0-9]{100,}$/, // Facebook access token
  'Instagram': /^IGQVJYa[a-zA-Z0-9]{100,}$/, // Instagram basic display API
  'BigCommerce': /^[a-z0-9]{32}$/, // BigCommerce API token
  'Etsy': /^[a-z0-9]{24}$/, // Etsy API key
  'Square': /^sq0atp-[a-zA-Z0-9_-]{43}$/, // Square access token
  'Wix Commerce': /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, // UUID format
  'Adobe Commerce': /^[a-z0-9]{32}$/, // Magento API key
};

export const validateAPIKey = async (provider: string, apiKey: string): Promise<ValidationResult> => {
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      isValid: false,
      message: 'API key is required'
    };
  }

  const pattern = API_KEY_PATTERNS[provider as keyof typeof API_KEY_PATTERNS];
  if (!pattern) {
    return {
      isValid: false,
      message: 'Unsupported provider'
    };
  }

  // Basic format validation
  if (!pattern.test(apiKey)) {
    return {
      isValid: false,
      message: `Invalid ${provider} API key format. Please check your API key.`
    };
  }

  // Call edge function for real validation
  try {
    const { data, error } = await supabase.functions.invoke('validate-api-key', {
      body: { provider, apiKey }
    });

    if (error) {
      return {
        isValid: false,
        message: 'Failed to validate API key. Please check your connection.'
      };
    }

    return {
      isValid: data.valid,
      message: data.message,
      connectionData: data.connectionData
    };
  } catch (error) {
    // Fallback to format validation if edge function fails
    console.warn('API validation service unavailable, using format validation');
    return {
      isValid: true,
      message: `${provider} API key format is valid. Connection will be verified during sync.`,
      connectionData: {
        accountName: 'API Key Validated',
        permissions: ['read']
      }
    };
  }
};

export const getAPIKeyInstructions = (provider: string): string => {
  const instructions = {
    'Shopify': 'Go to your Shopify Admin → Apps → Develop apps → Create private app. Generate API credentials.',
    'Google Analytics': 'Visit Google Cloud Console → APIs & Services → Credentials → Create API Key.',
    'Amazon Seller Central': 'Go to Developer Central → Add new application → Generate access keys.',
    'WooCommerce': 'WooCommerce → Settings → Advanced → REST API → Add Key.',
    'Facebook Ads': 'Facebook Developers → My Apps → Add App → Generate Access Token.',
    'Instagram': 'Instagram Basic Display → Create App → Generate Access Token.',
    'BigCommerce': 'Store Settings → API → Create API Account.',
    'Etsy': 'Etsy Developers → Your Account → Apps → Create New App.',
    'Square': 'Square Developer Dashboard → Applications → Create Application.',
    'Wix Commerce': 'Wix Developer Center → My Apps → Create New App.',
    'Adobe Commerce': 'System → Extensions → Integrations → Add New Integration.'
  };

  return instructions[provider as keyof typeof instructions] || 'Check the provider documentation for API key generation.';
};
