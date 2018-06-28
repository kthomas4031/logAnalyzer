import * as fs from "fs";
import * as path from "path";

import { config } from "../config";

export function enumerateFiles() {
	let files = [];

	fs.readdirSync(config.get("basePath")).forEach(function(file) {
		if (fs.statSync(path.join(config.get("basePath"), file)).isFile()) {
			files.push(path.join(config.get("basePath"), file));
		} else {
			let folder = file;

			// NOTE: This only goes two folder levels deep
			fs.readdirSync(path.join(config.get("basePath"), file)).forEach(function(file) {
				files.push(path.join(config.get("basePath"), folder, file));
			});
		}
	});

	return files;
}
