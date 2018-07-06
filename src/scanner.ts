import * as fs from "fs";
import { createInterface } from "readline";

const whitelistJSON = [
	"name",
	"errorCode",
	"service",
	"level",
	"error",
	"err",
	"resErr",
	"msg",
	"eventName",
	"taskType",
	"httpStatusCode",
	"httpStatusMessage",
	"registrationData",
	"message",
	"command",
	"resStatusCode",
	"initializingModule",
	"relation",
	"type",
	"maintenanceType",
	"processName",
	"reason",
	"pm2Command",
	"resSentPart",
	"processName",
	"instanceName",
	"description",
	"serviceStatus",
	"msoLicenseStatus",
	"taskOutput",
	"data",
	"req",
	"method",
	"taskInput",
	"callingService",
	"parent"
];

function removeProps(objectJSON) {
	for (let key in objectJSON) {
		if (objectJSON.hasOwnProperty(key)) {
			if (whitelistJSON.indexOf(key) === -1 || objectJSON[key] === "") {
				delete objectJSON[key];
			} else if (typeof objectJSON[key] === `object`) {
				removeProps(objectJSON[key]);
			}
		}
	}

	return objectJSON;
}

export function scanLines(sanitizedFiles) {
	let writeStream = fs.createWriteStream(`output.txt`);

	for (let x = 0; x < sanitizedFiles.length; x++) {
		const readline = createInterface({
			'input': fs.createReadStream(sanitizedFiles[x])
		});
		let lineNumber = 0;
		let count = {};

		readline.on(`line`, function(line) {
			lineNumber += 1;
			if (line[0] === `{`) {
				let jsonObject = JSON.parse(line);
				if (jsonObject !== undefined) {
					removeProps(jsonObject);

					if (count[JSON.stringify(jsonObject)] === undefined) {
						count[JSON.stringify(jsonObject)] = 1;
					} else {
						count[JSON.stringify(jsonObject)] += 1;
					}
				} else {
					console.error(
						"Error Parsing JSON line " + lineNumber + " in " + sanitizedFiles[x]
					);
				}
			}
		});

		readline.on("close", function() {
			let outputJSON = JSON.stringify(count, undefined, 4);
			outputJSON = outputJSON.replace(/\\"/g, '"');

			writeStream.write("\n === " + sanitizedFiles[x] + " === \n" + outputJSON);
			if (x + 1 < sanitizedFiles.length) {
				console.log("Starting work on file: " + sanitizedFiles[x + 1]);
			}
		});
	}
}
