import fs from "node:fs";
import { config } from "../config";

export class LastFirstConnectionTime {
	lastFirstConnectionTimestamp: number;

	constructor() {
		this.lastFirstConnectionTimestamp = this.read();
	}

	read() {
		return Number(fs.readFileSync(config.lastFirstConnectionTimestampTextFile));
	}

	isSendableTime() {
		this.lastFirstConnectionTimestamp = this.read();
		return (
			new Date().getTime() >
			this.lastFirstConnectionTimestamp + config.rateLimit
		);
	}

	write() {
		fs.writeFileSync(
			config.lastFirstConnectionTimestampTextFile,
			new Date().getTime().toString(),
		);
	}
}
