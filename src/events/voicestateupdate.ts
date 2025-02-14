import { Events, type VoiceState } from "discord.js";
import { config } from "../config.ts";
import { lastFirstConnectionTime, voiceMemberSize } from "../index.ts";
import type { Event } from "./index.ts";

export default {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		if (newState.channelId === config.voiceChannelId) {
			await exec(newState);
		} else if (oldState.channelId === config.voiceChannelId) {
			await exec(oldState);
		}

		async function exec(voiceState: VoiceState) {
			if (!lastFirstConnectionTime.isSendableTime()) return;

			if (!voiceState.channel) {
				console.error(
					"voice state's voice channel is null. we dont know why it is null.",
				);
				return;
			}

			const previousSize = voiceMemberSize.size;
			voiceMemberSize.size = voiceState.channel.members.size;
			if (previousSize !== 0) return;

			const channel = await voiceState.client.channels.fetch(
				config.textChannelId,
			);
			if (!channel)
				throw new Error('"textChannelId" channel is 404. check the config.');
			if (!channel.isTextBased())
				throw new Error(
					'"textChannelId" channel is not text based channel. check the config.',
				);
			if (!channel.isSendable()) {
				console.error(
					'"textChannelId" channel is not sendable channel. check your server\'s permission settings.',
				);
				return;
			}

			lastFirstConnectionTime.write();

			const roles = config.mentionRoles.map((roles) => `<@&${roles}>`);
			const users = config.mentionUsers.map((users) => `<@&${users}>`);
			await channel.send(
				`${roles.concat(users).join(" ")} ${voiceState.member?.displayName} (${voiceState.member?.user.username})が通話を開始しました。`,
			);
		}
	},
} satisfies Event<Events.VoiceStateUpdate>;
