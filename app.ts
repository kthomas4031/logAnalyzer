"use strict";

import { enumerateFiles } from "./src/enumerate";
import { readSchema } from "./src/schema";
import { sanitize } from "./src/sanitize";
import { process } from "./src/process";

(async function main() {
	let files = enumerateFiles();

	let schema = await readSchema();

	let sanitizedFileList = sanitize(files);

	process(sanitizedFileList, schema);
})();
