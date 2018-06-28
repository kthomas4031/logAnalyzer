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
	"req" ,
	"method",
	"taskInput",
	"callingService",
	"parent"
];

export function scanLines(sanitizedFiles) {
	let writeStream = fs.createWriteStream("output.txt");

	for (let x = 0; x < sanitizedFiles.length; x++) {
		const readline = createInterface({
			"input": fs.createReadStream(sanitizedFiles[x])
		});

		let lines = [];
		let lineNumber = 0;
		let uniqueJSONObjects = [];

		let count = {};

		readline.on("line", function(line) {
			lineNumber += 1;
			if (line[0] === "{") {
				let jsonObject = JSON.parse(line);
				if (jsonObject !== undefined) {
					Object.keys(jsonObject).forEach(function(key) {
						delete jsonObject[key];
					});

					if (count[JSON.stringify(jsonObject)] === undefined) {
						count[JSON.stringify(jsonObject)] = 1;
					} else {
						count[JSON.stringify(jsonObject)] += 1;
					}

					uniqueJSONObjects.push(JSON.stringify(Object.keys(jsonObject)));
				} else {
					console.error("Error Parsing JSON line " + lineNumber + " in " + sanitizedFiles[x]);
				}
			}
		});

		readline.on("close", function() {
			count = JSON.stringify(count, undefined, 4);

			writeStream.write("\n === " + sanitizedFiles[x] + " === \n" + count);
			if ((x + 1) < sanitizedFiles.length) {
				console.log("Starting work on file: " + sanitizedFiles[x + 1]);
			}
		});
	}
}
