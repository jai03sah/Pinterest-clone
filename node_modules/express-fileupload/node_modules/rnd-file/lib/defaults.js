const { tmpdir } = require('node:os');

const DEFAULTS = {
  fileName: 'random.file',
  filePath: tmpdir(),
  fileSize: 1024,
  chunkSize: 1024,
  hashAlgo: 'md5',
};

Object.freeze(DEFAULTS);

module.exports = DEFAULTS;
