/**
 * Security utility for masking sensitive data in logs
 * CRITICAL: Never log raw secrets in production environments
 */

export interface SecretMaskingOptions {
  showFirst?: number;
  showLast?: number;
  maskChar?: string;
  minMaskLength?: number;
}

/**
 * Masks a secret value for safe logging
 * @param secret The secret value to mask
 * @param options Masking configuration
 * @returns Safely masked string or 'NOT_SET' if secret is empty
 */
export function maskSecret(secret: string | undefined | null, options: SecretMaskingOptions = {}): string {
  if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {
    return 'NOT_SET';
  }

  const {
    showFirst = 0,
    showLast = 0,
    maskChar = '*',
    minMaskLength = 8
  } = options;

  const trimmedSecret = secret.trim();
  
  // For very short secrets, mask everything
  if (trimmedSecret.length <= 6) {
    return maskChar.repeat(Math.max(minMaskLength, 6));
  }

  // Calculate visible and masked parts
  const visibleLength = showFirst + showLast;
  const maskLength = Math.max(minMaskLength, trimmedSecret.length - visibleLength);

  if (visibleLength >= trimmedSecret.length) {
    // Don't show any actual characters if they would reveal too much
    return maskChar.repeat(Math.max(minMaskLength, 8));
  }

  const firstPart = showFirst > 0 ? trimmedSecret.substring(0, showFirst) : '';
  const lastPart = showLast > 0 ? trimmedSecret.substring(trimmedSecret.length - showLast) : '';
  const maskedPart = maskChar.repeat(maskLength);

  return `${firstPart}${maskedPart}${lastPart}`;
}

/**
 * Masks common API key patterns for logging
 */
export function maskApiKey(apiKey: string | undefined | null): string {
  if (!apiKey) return 'NOT_SET';
  
  // For API keys, show only key type prefix and mask the rest
  if (apiKey.startsWith('sk-')) {
    return `sk-${maskSecret(apiKey.substring(3), { minMaskLength: 12 })}`;
  }
  
  if (apiKey.startsWith('pk-')) {
    return `pk-${maskSecret(apiKey.substring(3), { minMaskLength: 12 })}`;
  }
  
  // For other patterns, mask most of it
  return maskSecret(apiKey, { showFirst: 4, minMaskLength: 16 });
}

/**
 * Masks environment variables for logging
 */
export function maskEnvVar(value: string | undefined | null, varName: string): string {
  if (!value) return 'NOT_SET';
  
  // Identify sensitive environment variables
  const sensitivePatterns = [
    'SECRET', 'KEY', 'TOKEN', 'PASSWORD', 'PASS', 'JWT', 
    'API', 'CLIENT_SECRET', 'PRIVATE', 'CREDENTIAL'
  ];
  
  const isSensitive = sensitivePatterns.some(pattern => 
    varName.toUpperCase().includes(pattern)
  );
  
  if (isSensitive) {
    return maskSecret(value, { showFirst: 2, showLast: 2, minMaskLength: 8 });
  }
  
  // For non-sensitive env vars, show more (like URLs, ports, etc.)
  return value.length > 50 ? `${value.substring(0, 30)}...` : value;
}

/**
 * Safe logging wrapper that automatically masks common secret patterns
 */
export function safeLog(message: string, data?: Record<string, any>) {
  if (!data) {
    console.log(message);
    return;
  }
  
  const maskedData: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      const upperKey = key.toUpperCase();
      if (upperKey.includes('SECRET') || upperKey.includes('KEY') || 
          upperKey.includes('TOKEN') || upperKey.includes('PASSWORD')) {
        maskedData[key] = maskSecret(value);
      } else {
        maskedData[key] = value;
      }
    } else {
      maskedData[key] = value;
    }
  }
  
  console.log(message, maskedData);
}

/**
 * Masks database connection strings
 */
export function maskConnectionString(connectionString: string | undefined | null): string {
  if (!connectionString) return 'NOT_SET';
  
  // Remove password from connection strings like postgres://user:password@host:port/db
  return connectionString.replace(/:([^@:]+)@/, ':****@');
}