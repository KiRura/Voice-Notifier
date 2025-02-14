import type { Client } from "discord.js";
import { config } from "../config";

export class VoiceMemberSize {
	public size: number;
	public isInit: boolean;

	constructor() {
		this.size = 0;
		this.isInit = false;
	}

	async initSize(client: Client<true>) {
		const channel = await client.channels.fetch(config.voiceChannelId);
		if (!channel?.isVoiceBased())
			throw new Error("voice channel is not voice based channel");
		this.size = channel.members.size;
		this.isInit = true;
	}
}
