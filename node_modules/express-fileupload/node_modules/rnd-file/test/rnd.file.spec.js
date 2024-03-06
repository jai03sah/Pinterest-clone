const { join } = require('node:path');
const { rm, stat } = require('node:fs/promises');
const { makeDir, generate, randomFile } = require('../lib/rnd.file');

describe('makeDir', () => {
  test('should be a function', () => {
    expect(typeof makeDir).toBe('function');
  });

  test('should create a directory', async () => {
    const path = join(__dirname, 'tmp', 'test');
    await rm(path, { recursive: true, force: true });
    const created = await makeDir(path);
    expect(created).toBe(true);
  });

  test('should return false if directory already exist ', async () => {
    const path = join(__dirname, 'tmp', 'test');
    const created = await makeDir(path);
    expect(created).toBe(false);
  });
});

describe('generate', () => {
  test('should be a function', () => {
    expect(typeof generate).toBe('function');
  });

  test('should generate a file', async () => {
    const dir = join(__dirname, 'tmp');
    const path = join(dir, 'random.file');
    const size = 2000;
    const chunk = 1024;
    await makeDir(dir);
    await generate(path, size, chunk);
    const stats = await stat(path);
    expect(stats.size).toBe(size);
  });

  test('should call callback on each chunk', async () => {
    const dir = join(__dirname, 'tmp');
    const path = join(dir, 'random.file');
    const size = 2000;
    const chunk = 1024;
    const cb = jest.fn();
    await makeDir(dir);
    await generate(path, size, chunk, cb);
    expect(cb).toHaveBeenCalledTimes(2);
  });
});

describe('randomFile', () => {
  const opts = {
    fileName: 'test.random.file',
    filePath: join(__dirname, 'tmp'),
    fileSize: 3000,
    chunkSize: 1024,
  };

  test('should be a function', () => {
    expect(typeof randomFile).toBe('function');
  });

  test('should generate a file', async () => {
    const file = await randomFile(opts);
    const stats = await stat(file.fullPath);
    expect(stats.size).toBe(opts.fileSize);
  });
});
