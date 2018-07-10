import * as fs from "fs";

import { createInterface } from "readline";

const whitelistJSON = [
	"callingService",
	"command",
	"data",
	"description",
	"err",
	"error",
	"errorCode",
	"eventName",
	"httpStatusCode",
	"httpStatusMessage",
	"initializingModule",
	"instanceName",
	"level",
	"maintenanceType",
	"message",
	"method",
	"msg",
	"msoLicenseStatus",
	"name",
	"parent",
	"pm2Command",
	"processName",
	"processName",
	"reason",
	"registrationData",
	"relation",
	"req",
	"resErr",
	"resSentPart",
	"resStatusCode",
	"service",
	"serviceStatus",
	"taskInput",
	"taskOutput",
	"taskType",
	"type"
];

function removeNonWhitelistedProperties(objectJSON) {
	for (let key in objectJSON) {
		if (objectJSON.hasOwnProperty(key)) {
			if (whitelistJSON.indexOf(key) === -1 || objectJSON[key] === "") {
				delete objectJSON[key];
			} else if (typeof objectJSON[key] === "object") {
				removeNonWhitelistedProperties(objectJSON[key]);
			}
		}
	}

	return objectJSON;
}

export function process(sanitizedFileList, schema) {
	let writeStream = fs.createWriteStream("output.txt");

	// For each file in files[]
	for (let x = 0; x < sanitizedFileList.length; x++) {
		const readline = createInterface({
			"input": fs.createReadStream(sanitizedFileList[x])
		});

		let lineNumber = 0;

		let count = {};

		readline.on("line", function(line) {
			lineNumber += 1;

			if (line[0] === "{") {
				let jsonObject = JSON.parse(line);

				if (jsonObject !== undefined) {
					removeNonWhitelistedProperties(jsonObject);

					if (count[JSON.stringify(jsonObject)] === undefined) {
						count[JSON.stringify(jsonObject)] = 1;
					} else {
						count[JSON.stringify(jsonObject)] += 1;
					}
				} else {
					console.error("Error Parsing JSON line " + lineNumber + " in " + sanitizedFileList[x]);
				}
			}
		});

		readline.on("close", function() {
			let outputJSON = JSON.stringify(count, undefined, 4);

			outputJSON = outputJSON.replace(/\\"/g, '"');

			writeStream.write("\n===> " + sanitizedFileList[x] + " <===\n" + outputJSON);

			console.log("Starting work on file: " + sanitizedFileList[x + 1]);
		});
	}
}
