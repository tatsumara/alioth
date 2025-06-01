const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.log.info(`${client.user.tag} logged in!`);
	},
};
