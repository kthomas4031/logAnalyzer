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
		default: path.join("/", "Users", "kthomas",  "Documents", "PrizmDoc Phase 2", "logs"),
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

(function main() {
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

	for (let x = 0; x < files.length; x++) {
		console.log(files[x]);
	}
	
})();
