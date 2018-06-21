`use strict`;

(function main() {
  let sanitize = require(`./sanitize.js`);
  let enumerateFiles = require(`./enumerate.js`);
  let scanLines = require(`./scanner.js`);

  let files = enumerateFiles();
  let sanitizedFiles = sanitize(files);
  scanLines(sanitizedFiles);
})();
