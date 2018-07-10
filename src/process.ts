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

let knownSchemas;

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
	knownSchemas = schema;
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

					updateSchema(Object.keys(jsonObject), sanitizedFileList[x]);

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

			outputJSON = outputJSON.replace(/\\"/g, "\"");

			writeStream.write("==> " + sanitizedFileList[x] + " <==" + "\n" + outputJSON + "\n");

			console.log("Finished work on file: " + sanitizedFileList[x]);
			if (x >= sanitizedFileList.length - 1) {

				return knownSchemas;
			}
		});
	}
}

function updateSchema(jsonSchema, filePath) {

	//clean up file path and remove extensions
	let fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.indexOf("."));

	//special case for ImagingServices because its inconsistent
	if (fileName.indexOf("ImagingServices") !== -1) {
		fileName = "ImagingServices";
	}
	//check if the schema contains the current log file
	if (!knownSchemas.hasOwnProperty(fileName)) {
		knownSchemas[fileName] = [];
	}

	let isKnownSchema = false;

	//check if the schema is known
	for (let schema in knownSchemas[fileName]) {
		if (knownSchemas[fileName][schema].toString() === jsonSchema.toString()) {
				isKnownSchema = true;
			}
		}
	//Add the new schema to the list of known schemas
	if (!isKnownSchema) {
			knownSchemas[fileName].push(jsonSchema);
		}
}
