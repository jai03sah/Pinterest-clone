const { tmpdir } = require('node:os');
const DEFAULTS = require('../lib/defaults');

describe('randomFile defaults settings', () => {
  test('should be an object', () => {
    expect(DEFAULTS).toBeTruthy();
    expect(typeof DEFAULTS).toBe('object');
  });

  test('should be frozen', () => {
    expect(Object.isFrozen(DEFAULTS)).toBe(true);
  });

  test('should have default fileName', () => {
    expect(DEFAULTS.fileName).toBeDefined();
    expect(DEFAULTS.fileName).toBeTruthy();
    expect(typeof DEFAULTS.fileName).toBe('string');
  });

  test('should have default filePath', () => {
    expect(DEFAULTS.filePath).toBeDefined();
    expect(DEFAULTS.filePath).toBeTruthy();
    expect(typeof DEFAULTS.filePath).toBe('string');
    expect(DEFAULTS.filePath).toBe(tmpdir());
  });

  test('should have default fileSize', () => {
    expect(DEFAULTS.fileSize).toBeDefined();
    expect(typeof DEFAULTS.fileSize).toBe('number');
    expect(DEFAULTS.fileSize).toBeGreaterThan(0);
  });

  test('should have default chunkSize', () => {
    expect(DEFAULTS.chunkSize).toBeDefined();
    expect(typeof DEFAULTS.chunkSize).toBe('number');
    expect(DEFAULTS.chunkSize).toBeGreaterThanOrEqual(1024);
  });
});
