import { Platform } from 'react-native';
import axios from 'axios';
import { BlobServiceClient } from '@azure/storage-blob';

// Security configuration
export const securityConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png'],
  rateLimit: {
    tokens: 100,
    refillRate: 10, // tokens per second
    capacity: 100
  },
  allowedDomains: ['your-api.azurewebsites.net'],
  sasTokenExpiry: 5, // minutes
  maxRetries: 3,
  retryTimeout: 10000, // ms
  keepAliveInterval: 30000 // ms
};

// Azure Storage configuration
export const storageConfig = {
  retryOptions: {
    maxTries: securityConfig.maxRetries,
    tryTimeoutInMs: securityConfig.retryTimeout,
  },
  keepAliveOptions: {
    enable: true,
    keepAliveIntervalInMs: securityConfig.keepAliveInterval,
  },
  allowInsecureConnection: false,
};

// Rate limiting implementation
class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly refillRate: number;
  private readonly capacity: number;

  constructor() {
    this.tokens = securityConfig.rateLimit.tokens;
    this.lastRefill = Date.now();
    this.refillRate = securityConfig.rateLimit.refillRate;
    this.capacity = securityConfig.rateLimit.capacity;
  }

  async canMakeRequest(): Promise<boolean> {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + timePassed * this.refillRate);
    this.lastRefill = now;

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

// Input validation
class InputValidator {
  private static readonly dangerousPatterns = /[<>'"]/g;
  private static readonly safeFileNamePattern = /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png)$/;

  static validateInput(input: string): boolean {
    if (!input || typeof input !== 'string') return false;
    const sanitized = input.replace(this.dangerousPatterns, '');
    return input === sanitized;
  }

  static validateFileName(fileName: string): boolean {
    return this.safeFileNamePattern.test(fileName);
  }

  static validateFileType(fileType: string): boolean {
    return securityConfig.allowedFileTypes.includes(fileType);
  }

  static validateFileSize(fileSize: number): boolean {
    return fileSize <= securityConfig.maxFileSize;
  }
}

// Network security
class NetworkSecurity {
  static configureAxios() {
    axios.defaults.headers.common['X-Content-Type-Options'] = 'nosniff';
    axios.defaults.headers.common['X-Frame-Options'] = 'DENY';
    axios.defaults.headers.common['X-XSS-Protection'] = '1; mode=block';
    axios.defaults.headers.common['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
    axios.defaults.headers.common['Content-Security-Policy'] = "default-src 'self'";

    axios.interceptors.request.use((config) => {
      const url = new URL(config.url || '');
      const isAllowedDomain = securityConfig.allowedDomains.includes(url.hostname);
      
      if (!isAllowedDomain) {
        throw new Error('Request blocked: unauthorized domain');
      }

      return config;
    });
  }
}

// Initialize network security
NetworkSecurity.configureAxios();

// Export security utilities
export const security = {
  rateLimiter: new RateLimiter(),
  validateInput: InputValidator.validateInput,
  validateFileName: InputValidator.validateFileName,
  validateFileType: InputValidator.validateFileType,
  validateFileSize: InputValidator.validateFileSize,
  validateFile: (fileName: string, fileType: string, fileSize: number): boolean => {
    return (
      InputValidator.validateFileName(fileName) &&
      InputValidator.validateFileType(fileType) &&
      InputValidator.validateFileSize(fileSize)
    );
  },
  storageConfig,
  config: securityConfig
};

export default security; 