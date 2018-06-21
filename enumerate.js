let fs = require(`fs`);
let path = require(`path`);

let config = require(`./config.js`);

function enumerateFiles() {
  let files = [];

  fs.readdirSync(config.get(`basePath`)).forEach(function(file) {
    if (fs.statSync(path.join(config.get(`basePath`), file)).isFile()) {
      files.push(path.join(config.get(`basePath`), file));
    } else {
      let subfolder = path.join(config.get(`basePath`), file);

      // NOTE: This only goes two folder levels deep
      fs.readdirSync(subfolder, function(file) {
        files.push(path.join(subfolder, file));
      });
    }
  });

  return files;
}

module.exports = enumerateFiles;
