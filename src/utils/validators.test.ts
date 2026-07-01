import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPhoneNumber } from './validators';

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('returns true for a valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('returns false for an invalid email', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('returns true for valid phone numbers', () => {
      expect(isValidPhoneNumber('1234567890')).toBe(true);
      expect(isValidPhoneNumber('123-456-7890')).toBe(true);
      expect(isValidPhoneNumber('(123) 456-7890')).toBe(true);
      expect(isValidPhoneNumber('+1 123 456 7890')).toBe(true);
    });

    it('returns false for phone numbers with less than 10 digits', () => {
      expect(isValidPhoneNumber('123-456-789')).toBe(false);
      expect(isValidPhoneNumber('123456789')).toBe(false);
    });

    it('returns false for phone numbers with invalid characters', () => {
      expect(isValidPhoneNumber('123-abc-7890')).toBe(false);
      expect(isValidPhoneNumber('!@#$%^&*()')).toBe(false);
    });
  });
});
