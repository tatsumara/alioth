const fs = require('node:fs');
const path = require('node:path');

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

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [ GatewayIntentBits.Guilds ] });
client.log = logger;

// iterate through commands and subfolders, load into collection
client.log.info('Loading commands...');
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
client.log.debug(`Found folders: [${commandFolders.join(', ')}]`);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder)
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	client.log.debug(`'${folder}' has commands: [${commandFiles.join(', ').replaceAll('.js', '')}]`);
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			client.log.warn(`'${file}' is missing required properties, skipping.`)
		}
	}
};

// iterate through events, assign
client.log.info('Assigning events...')
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
client.log.debug(`Found events: [${eventFiles.join(', ').replaceAll('.js', '')}]`)

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (client, ...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (client, ...args) => event.execute(client, ...args));
	}
}

client.login(process.env.DISCORD_TOKEN);