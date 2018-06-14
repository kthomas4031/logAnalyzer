"use strict";

let fs = require('fs');
let path = require('path');

let convict = require('convict');
let config = convict({
	env: {
		doc: "The application environment.",
		format: ["production", "development", "test"],
		default: "development",
		env: "NODE_ENV",
		arg: "env"
	},
	basePath: {
		doc: "The PrizmDoc log file path.",
		format: "*",
		default: path.join("/", "Prizm", "logs"),
		env: "BASE_PATH",
		arg: "basePath"
	},
	wumbo: {
		doc: "wumbo",
		format: "Boolean",
		default: true,
		env: "WUMBO",
		arg: "wumbo"
	}
});

// Perform validation
config.validate({ allowed: "strict" });

const blacklist = ["console", "pm2.log", "MsOfficeConverter.log", "ms-office-conversion-service.log", "mongod.log"];

function enumerateFiles() {
	let files = [];

    fs.readdirSync(config.get("basePath")).forEach(function(file) {
		if (fs.statSync(path.join(config.get("basePath"), file)).isFile()) {
			files.push(path.join(config.get("basePath"), file));
		} else {
			let subfolder = path.join(config.get("basePath"), file);

			// LIMITATION: This only goes two folder levels deep
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
		let onBlacklist = false;

		for (let y = 0; y < blacklist.length; y++) {
			if (files[x].indexOf(blacklist[y]) !== -1) {
				onBlacklist = true;
				break;
			}
		}

		if (onBlacklist === false) {
			sanitizedFiles.push(files[x]);
		}
	}

	return sanitizedFiles;
}

(function main() {
	let files = enumerateFiles();

	let sanitizedFiles = sanitize(files)

	// Check for valid JSON
	for (let x = 0; x < sanitizedFiles.length; x++) {
		let readline = require('readline').createInterface({
			input: require('fs').createReadStream(sanitizedFiles[x])
		});
	
		let lines = [];

		readline.on("line", function(line) {
				if (line !== "") {
					JSON.parse(line);
				}
		});

		readline.on("close", function() {
		})
	}
})();
