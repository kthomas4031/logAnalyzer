"use strict";

import { sanitize } from "./src/sanitize";
import { enumerateFiles } from "./src/enumerate";
import { scanLines } from "./src/scanner";
import { getSchema } from "./src/schemaRetriever";

let files = enumerateFiles();

let sanitizedFiles = sanitize(files);

getSchema(sanitizedFiles);
scanLines(sanitizedFiles);
