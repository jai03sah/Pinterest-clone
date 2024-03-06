const { join } = require('node:path');
const { createWriteStream } = require('node:fs');
const { mkdir, access } = require('node:fs/promises');
const { createHash, randomBytes } = require('node:crypto');

// Read default options from lib/defaults.js.
const DEFAULTS = require('./defaults');

/**
 * Creates a directory if it doesn't exist.
 * @param {String} path Path to the directory.
 * @returns {Promise<Boolean>} Promise that resolves to true if directory was created.
 */
async function makeDir(path) {
  try {
    await access(path);
    return false;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    await mkdir(path, { recursive: true });
    return true;
  }
}

/**
 * Generates a random file with given path, size and chunks size.
 * @param {String} fullPath Full path to the file.
 * @param {Number} fileSize File size in bytes.
 * @param {Number} chunkSize Chunk size in bytes.
 * @param {Function} cb Callback function to be called on each chunk.
 * @returns {Promise<undefined>} Promise that resolves when file is generated.
 */
function generate(fullPath, fileSize, chunkSize, cb) {
  return new Promise((resolve, reject) => {
    const fileStream = createWriteStream(fullPath);
    fileStream.on('finish', () => resolve());
    fileStream.on('error', reject);

    let rest = fileSize;
    while (rest > 0) {
      const size = Math.min(rest, chunkSize);
      const chunk = randomBytes(size);
      fileStream.write(chunk);
      if (cb) cb(chunk);
      rest -= size;
    }
    fileStream.end();
  });
}

/**
 * Generates a random file with given options.
 * @param {Object} opts { fileName, filePath, fileSize, chunkSize }
 * @returns {Promise<Object>} Generated file details { path, name, size, md5 }.
 */
async function randomFile(opts) {
  const {
    fileName, filePath, fileSize, chunkSize, hashAlgo,
  } = { ...DEFAULTS, ...opts };
  await makeDir(filePath);
  const hash = createHash(hashAlgo);
  const fullPath = join(filePath, fileName);
  await generate(fullPath, fileSize, chunkSize, (chunk) => hash.update(chunk));
  return {
    fullPath, filePath, fileName, fileSize, md5: hash.digest('hex'),
  };
}

module.exports = { makeDir, generate, randomFile };
