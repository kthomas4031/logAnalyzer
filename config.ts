import * as path from "path";
import * as convict from "convict";

export const config = convict({
	"env": {
		"doc": "The application environment.",
		"format": ["production", "development", "test"],
		"default": "development",
		"env": "NODE_ENV",
		"arg": "env"
	},
	"basePath": {
		"doc": "The PrizmDoc log file path.",
		"format": "*",
		"default": process.platform === "win32" ? path.join("/", "Prizm", "logs") : path.join("/", "usr", "share", "prizm", "logs"),
		"env": "BASE_PATH",
		"arg": "basePath"
	},
	"wumbo": {
		"doc": "wumbo",
		"format": "Boolean",
		"default": true,
		"env": "WUMBO",
		"arg": "wumbo"
	}
});

// Perform validation
config.validate({
	"allowed": "strict"
});
