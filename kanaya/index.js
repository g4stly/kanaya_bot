const MatrixClient = require('matrix-bot-sdk').MatrixClient;
const AutojoinRoomsMixin = require('matrix-bot-sdk').AutojoinRoomsMixin;
const SimpleFsStorageProvider = require('matrix-bot-sdk').SimpleFsStorageProvider;
const Discord = require('discord.js');

const storage = require('./storage');
const commands = require('./commands');

function Kanaya() { }

Kanaya.prototype.handleMatrixEvent = function() {
	return (roomId, event) => {
		if (!event.content
			|| event.type !== 'm.room.message'
			|| event.content.msgtype !== 'm.text'
		) return;

		this.matrixClient.getUserId().then((id) => {
			if (event.sender === id) return;

			const matches = commands.regex.exec(event.content.body);
			if (!matches || matches.length !== 2) return;

			let cmd = commands.list[matches[1]];
			if (cmd && (cmd = cmd(commands.MATRIX))) cmd(this, roomId, event);
		});
	}
}

Kanaya.prototype.handleDiscordEvent = function() {
	return (message) => {
		const matches = commands.regex.exec(message.content);
		if (!matches || matches.length !== 2) return;

		let cmd = commands.list[matches[1]];
		if (cmd && (cmd = cmd(commands.DISCORD))) cmd(this, message);
	}
}

function required(conf, key, msg) {
	if (!conf[key]) throw 'broken config: ' + msg;
}

Kanaya.prototype.init = function (conf) {
	this.conf = conf;

	required(this.conf, 'matrix', 'missing matrix section');
	required(this.conf.matrix, 'homeserver', 'missing homeserver url');
	required(this.conf.matrix, 'token', 'missing matrix access token');

	required(this.conf, 'discord', 'missing discord section');
	required(this.conf.discord, 'token', 'missing discord access token');

	required(this.conf, 'dbPath', 'missing dbPath');

	const storageProvider = new storage.Provider();
	return storageProvider.init(this.conf).then(() => {

		this.db = storage.DB(this.conf);

		this.matrixClient = new MatrixClient(
			this.conf.matrix.homeserver,
			this.conf.matrix.token,
			storageProvider
		);

		this.discordClient = new Discord.Client();

		if (this.conf.matrix.autojoin) {
			AutojoinRoomsMixin.setupOnClient(this.matrixClient);
		}

		this.matrixClient.on('room.event', this.handleMatrixEvent());
		this.discordClient.on('message', this.handleDiscordEvent());

		return this;
	});
}

Kanaya.prototype.start = function () {
		this.matrixClient.start();
		this.discordClient.login(this.conf.discord.token);
}

exports.Kanaya = Kanaya;
