const getEnvVar = (key: string, defaultValue?: string): string => {
  // Durante o build, retorna um valor padrão
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
    return defaultValue || 'dummy_value_for_build';
  }
  
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const ASAAS_CONFIG = {
  API_KEY: getEnvVar('ASAAS_API_KEY', 'dummy_key_for_build'),
  BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/api/v3',
  WEBHOOK_TOKEN: getEnvVar('ASAAS_WEBHOOK_TOKEN', 'default_token'),
  MIN_CREDIT_CARD_VALUE: 5,
  PAYMENT_DEADLINE_HOURS: 24,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const; 