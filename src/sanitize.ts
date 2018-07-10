const blacklist = [
	"console",
	"pm2.log",
	"MsOfficeConverter.log",
	"ms-office-conversion-service.log",
	"mongod.log",
];

export function sanitize(files) {
	let sanitizedFiles = [];

	// For each file in files[]
	for (let x = 0; x < files.length; x++) {
		let isBlacklisted = false;

		for (let y = 0; y < blacklist.length; y++) {
			if (files[x].indexOf(blacklist[y]) !== -1) {
				isBlacklisted = true;
				break;
			}
		}

		if (!isBlacklisted) {
			sanitizedFiles.push(files[x]);
		}
	}

	return sanitizedFiles;
}
