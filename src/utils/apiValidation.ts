
export const validateApiKey = async (provider: string, apiKey: string): Promise<boolean> => {
  if (!apiKey || apiKey.trim().length === 0) {
    return false;
  }

  // Basic format validation for different providers
  switch (provider.toLowerCase()) {
    case 'shopify':
      // Shopify private app tokens are 32 characters long and start with 'shppa_'
      return apiKey.length >= 32 && (apiKey.startsWith('shppa_') || apiKey.length === 64);
    
    case 'google analytics':
      // Google Analytics API keys are typically 39 characters long
      return apiKey.length >= 35 && apiKey.match(/^[A-Za-z0-9_-]+$/);
    
    case 'amazon seller central':
      // Amazon MWS tokens are typically 20+ characters
      return apiKey.length >= 20 && apiKey.match(/^[A-Za-z0-9]+$/);
    
    case 'woocommerce':
      // WooCommerce consumer keys start with 'ck_'
      return apiKey.startsWith('ck_') && apiKey.length >= 40;
    
    case 'facebook ads':
      // Facebook API tokens are typically 195+ characters
      return apiKey.length >= 100 && apiKey.match(/^[A-Za-z0-9_-]+$/);
    
    case 'instagram':
      // Instagram access tokens are similar to Facebook
      return apiKey.length >= 50 && apiKey.match(/^[A-Za-z0-9_-]+$/);
    
    case 'bigcommerce':
      // BigCommerce API tokens are typically 64 characters
      return apiKey.length >= 40 && apiKey.match(/^[A-Za-z0-9]+$/);
    
    case 'etsy':
      // Etsy API keys are 24 characters
      return apiKey.length >= 20 && apiKey.match(/^[A-Za-z0-9]+$/);
    
    case 'square':
      // Square access tokens start with specific prefixes
      return (apiKey.startsWith('EAA') || apiKey.startsWith('sq0atp')) && apiKey.length >= 60;
    
    case 'wix commerce':
      // Wix API keys are UUIDs or similar format
      return apiKey.length >= 32 && apiKey.match(/^[A-Za-z0-9_-]+$/);
    
    case 'adobe commerce':
      // Adobe Commerce (Magento) tokens are typically 32+ characters
      return apiKey.length >= 32 && apiKey.match(/^[A-Za-z0-9]+$/);
    
    default:
      // For custom integrations, just check it's not empty and has reasonable length
      return apiKey.length >= 10 && apiKey.match(/^[A-Za-z0-9_-]+$/);
  }
};

export const getApiKeyFormat = (provider: string): string => {
  switch (provider.toLowerCase()) {
    case 'shopify':
      return 'Should start with "shppa_" and be 32+ characters';
    case 'google analytics':
      return 'Should be 35+ alphanumeric characters';
    case 'amazon seller central':
      return 'Should be 20+ alphanumeric characters';
    case 'woocommerce':
      return 'Should start with "ck_" and be 40+ characters';
    case 'facebook ads':
      return 'Should be 100+ characters long access token';
    case 'instagram':
      return 'Should be 50+ characters long access token';
    case 'bigcommerce':
      return 'Should be 40+ alphanumeric characters';
    case 'etsy':
      return 'Should be 20+ alphanumeric characters';
    case 'square':
      return 'Should start with "EAA" or "sq0atp" and be 60+ characters';
    case 'wix commerce':
      return 'Should be 32+ characters UUID format';
    case 'adobe commerce':
      return 'Should be 32+ alphanumeric characters';
    default:
      return 'Should be 10+ alphanumeric characters with underscores/hyphens allowed';
  }
};
