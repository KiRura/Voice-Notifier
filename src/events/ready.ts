import { Events } from "discord.js";
import { voiceMemberSize } from "../index.ts";
import type { Event } from "./index.ts";

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await voiceMemberSize.initSize(client);
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
} satisfies Event<Events.ClientReady>;
