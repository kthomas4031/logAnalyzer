import * as fs from "fs";

import { createInterface } from "readline";

export async function readSchema() {
	let readStream = fs.createReadStream("logFileSchema.json");

	let buffer = "";

	readStream.on("data", function(chunk) {
		buffer += chunk;
	});

	return new Promise(function(resolve, reject) {
		readStream.on("end", function() {
			return resolve(JSON.parse(buffer));
		});
	});
}

export function writeSchema(schema) {
	console.log("Updated Schema: " + JSON.stringify(schema));

	let writeStream = fs.createWriteStream("LogFileSchema.json");

	writeStream.write(JSON.stringify(schema));

	writeStream.on("finish", function() {
		console.log("Done!");
	});
}
