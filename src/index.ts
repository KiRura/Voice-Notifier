import process from "node:process";
import { URL } from "node:url";
import { Client, GatewayIntentBits } from "discord.js";
import { loadCommands, loadEvents } from "./util/loaders.ts";
import { registerEvents } from "./util/registerEvents.ts";
import { VoiceMemberSize } from "./util/voiceMemberSize.ts";
import { LastFirstConnectionTime } from "./util/lastFirstConnectionTime.ts";

// Initialize the client
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

export const voiceMemberSize = new VoiceMemberSize();
export const lastFirstConnectionTime = new LastFirstConnectionTime();

// Load the events and commands
const events = await loadEvents(new URL("events/", import.meta.url));
const commands = await loadCommands(new URL("commands/", import.meta.url));

// Register the event handlers
registerEvents(commands, events, client);

// Login to the client
void client.login(process.env.DISCORD_TOKEN);
