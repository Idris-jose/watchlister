// Example test file
// Install testing framework: npm install --save-dev jest

describe('Example Test Suite', () => {
  test('should add two numbers correctly', () => {
    const result = 2 + 2;
    expect(result).toBe(4);
  });

  test('should handle edge cases', () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
  });
});

// Add this to package.json scripts:
// "test": "jest"
// "test:watch": "jest --watch"
// "test:coverage": "jest --coverage"
