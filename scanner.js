const whitelistJSON = [
  `name`,
  `errorCode`,
  `errorId`,
  `service`,
  `level`,
  `error`,
  `err`,
  `resErr`,
  `msg`
];

function removeProps(obj) {
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (!whitelistJSON.includes(p)) {
        delete obj[p];
      } else if (typeof obj[p] == `object`) {
        removeProps(obj[p]);
      }
    }
  }
  return obj;
}

function scanLines(sanitizedFiles) {
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

      if (line !== ``) {
        let jsonObject = JSON.parse(line);

        if (jsonObject !== undefined) {
          removeProps(jsonObject);

          if (count[JSON.stringify(jsonObject)] === undefined) {
            count[JSON.stringify(jsonObject)] = 1;
          } else {
            count[JSON.stringify(jsonObject)] += 1;
          }

          uniqueJSONObjects.push(JSON.stringify(Object.keys(jsonObject)));
        } else {
          console.error(
            `Error Parsing JSON line ${lineNumber} in ${sanitizedFiles[x]}`
          );
        }
      }
    });

    readline.on(`close`, function() {
      console.log();
      console.log(`==== ` + sanitizedFiles[x] + `====`);
      console.log();
      console.log(count);
    });
  }
}

module.exports = scanLines;
