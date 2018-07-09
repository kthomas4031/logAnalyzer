import * as fs from "fs";
import { createInterface } from "readline";

export function getSchema(sanitizedFiles) {
	let schemaWriteStream = fs.createWriteStream("LogFileJsonSchema.JSON");
	for (let x = 0; x < sanitizedFiles.length; x++) {
		const readline = createInterface({
			'input': fs.createReadStream(sanitizedFiles[x])
		});
		let lineNumber = 0;
		let count = {};
		let uniqueJSONObject = {};

		readline.on(`line`, function(line) {
			lineNumber += 1;
			if (line[0] === `{`) {
				let jsonObject = JSON.parse(line);
				if (jsonObject !== undefined && jsonObject !== {}) {
					if (!uniqueJSONObject.hasOwnProperty('file: ' + sanitizedFiles[x])) {
						uniqueJSONObject['file: ' + sanitizedFiles[x]] = [];
					}
					if (uniqueJSONObject['file: ' + sanitizedFiles[x]].indexOf(JSON.stringify(Object.keys(jsonObject))) === -1) {
						uniqueJSONObject['file: ' + sanitizedFiles[x]].push(JSON.stringify(Object.keys(jsonObject)));
					}
				}
			}
		});

		readline.on("close", function() {
			let outputSchema = JSON.stringify(uniqueJSONObject);
			if (outputSchema !== "{}") {
				outputSchema = outputSchema.replace(/\\"/g, '\'');
				schemaWriteStream.write(outputSchema + '\n');
			}
		});
	}
}
