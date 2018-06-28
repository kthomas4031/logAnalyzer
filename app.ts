"use strict";

import { sanitize } from "./src/sanitize";
import { enumerateFiles } from "./src/enumerate";
import { scanLines } from "./src/scanner";

let files = enumerateFiles();

let sanitizedFiles = sanitize(files);

scanLines(sanitizedFiles);
