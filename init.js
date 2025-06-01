require('dotenv').config();

// initialize logger and set level depending on environment
const logger = require('tracer').colorConsole({
	level: process.env.DEV ? 'log' : 'info',
	format: [
		'{{timestamp}} {{title}} ({{file}}) {{message}}',
		{
			error: '{{timestamp}} {{title}} ({{file}}) {{message}}\n{{stack}}',
		}
	],
	preprocess: data => {
		data.title = data.title.toUpperCase().padStart(5);
		data.file = data.file.slice(0, -3);
	}
})

const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [ GatewayIntentBits.Guilds ] });
client.log = logger;

client.once(Events.ClientReady, readyClient => {
	client.log.info(`${readyClient.user.tag} logged in!`);
});

client.login(process.env.DISCORD_TOKEN);