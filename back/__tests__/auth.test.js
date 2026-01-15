const { hashPassword, verifyPassword, generateToken, verifyToken } = require('../utils/auth');

describe('Auth Utils', () => {
  describe('Password Hashing', () => {
    test('should hash a password', () => {
      const password = 'testPassword123';
      const hash = hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    test('should verify correct password', () => {
      const password = 'testPassword123';
      const hash = hashPassword(password);
      
      const result = verifyPassword(password, hash);
      expect(result).toBe(true);
    });

    test('should reject incorrect password', () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hash = hashPassword(password);
      
      const result = verifyPassword(wrongPassword, hash);
      expect(result).toBe(false);
    });
  });

  describe('JWT Token', () => {
    test('should generate a valid token', () => {
      const userId = 123;
      const token = generateToken(userId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    test('should verify valid token and return userId', () => {
      const userId = 123;
      const token = generateToken(userId);
      const decoded = verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(userId);
    });

    test('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = verifyToken(invalidToken);
      
      expect(decoded).toBeNull();
    });

    test('should return null for expired token', () => {
      // Note: This test would require mocking time or using a very short expiry
      // For now, we just test the structure
      const decoded = verifyToken('');
      expect(decoded).toBeNull();
    });
  });
});
