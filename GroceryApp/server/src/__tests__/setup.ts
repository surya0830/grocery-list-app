import dotenv from 'dotenv';
import { beforeAll, afterAll } from '@jest/globals';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Add any global test setup here
beforeAll(() => {
  // Setup test database or other resources
});

afterAll(() => {
  // Cleanup test resources
}); 