`use strict`;

let fs = require(`fs`);
let path = require(`path`);

let convict = require(`convict`);
let config = convict({
  env: {
    doc: `The application environment.`,
    format: [`production`, `development`, `test`],
    default: `development`,
    env: `NODE_ENV`,
    arg: `env`
  },
  basePath: {
    doc: `The PrizmDoc log file path.`,
    format: `*`,
    default: path.join(`/`, `Prizm`, `logs`),
    env: `BASE_PATH`,
    arg: `basePath`
  },
  wumbo: {
    doc: `wumbo`,
    format: `Boolean`,
    default: true,
    env: `WUMBO`,
    arg: `wumbo`
  }
});

// Perform validation
config.validate({
  allowed: `strict`
});

const blacklist = [
  `console`,
  `pm2.log`,
  `MsOfficeConverter.log`,
  `ms-office-conversion-service.log`,
  `mongod.log`
];

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

function sanitize(files) {
  let sanitizedFiles = [];

  for (let x = 0; x < files.length; x++) {
    let isBlacklisted = false;

    for (let y = 0; y < blacklist.length; y++) {
      if (files[x].indexOf(blacklist[y]) !== -1) {
        isBlacklisted = true;
        break;
      }
    }

    if (!isBlacklisted) {
      sanitizedFiles.push(files[x]);
    }
  }

  return sanitizedFiles;
}

function removeProp(obj, propName) {
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (p == propName) {
        delete obj[p];
      } else if (typeof obj[p] == "object") {
        removeProp(obj[p], propName);
      }
    }
  }
  return obj;
}

function scanLines(sanitizedFiles) {
  // Check for valid JSON
  for (let x = 0; x < sanitizedFiles.length; x++) {
    let readline = require(`readline`).createInterface({
      input: require(`fs`).createReadStream(sanitizedFiles[x])
    });

    let lines = [];
    let lineNumber = 0;
    let uniqueJSONObjects = [];

    let count = {};

    readline.on(`line`, function(line) {
      lineNumber += 1;

      if (line !== "") {
        let jsonObject = JSON.parse(line);

        if (jsonObject !== undefined) {
          // Only add this to uniqueJSONObjects if keys are unique
          if (
            !uniqueJSONObjects.includes(JSON.stringify(Object.keys(jsonObject)))
          ) {
            removeProp(jsonObject, "pid");
            removeProp(jsonObject, "taskid");
            removeProp(jsonObject, "gid");
            removeProp(jsonObject, "tid");
            removeProp(jsonObject, "time");
            removeProp(jsonObject, "duration");
            removeProp(jsonObject, "expirationTime");
            removeProp(jsonObject, "duration");
            removeProp(jsonObject, "cutoffDateTime");

            if (count[JSON.stringify(jsonObject)] === undefined) {
              count[JSON.stringify(jsonObject)] = 1;
            } else {
              count[JSON.stringify(jsonObject)] += 1;
            }

            uniqueJSONObjects.push(JSON.stringify(Object.keys(jsonObject)));
          }
        } else {
          console.error(
            `Error Parsing JSON line ${lineNumber} in ${sanitizedFiles[x]}`
          );
        }
      }
    });

    readline.on(`close`, function() {
      for (let y = 0; y < uniqueJSONObjects.length; y++) {
        if (y === 0) {
          console.log();
          console.log("==== " + sanitizedFiles[x] + " ====");
          console.log();
        }

        // console.log(uniqueJSONObjects[y]);
        console.log(count);
      }
    });
  }
}

(function main() {
  let files = enumerateFiles();

  let sanitizedFiles = sanitize(files);

  scanLines(sanitizedFiles);
})();
