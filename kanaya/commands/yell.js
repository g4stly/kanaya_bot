const common = require('./common.js');

const sql = {
	get: 'SELECT [RoomId] FROM [DefaultRoom] WHERE [RoomType] = ?;'
};

function echo(text) {
	const matches = common.regex.exec(text);
	if (!matches || matches.length !== 2) {
		return 'yell(): banic!';	// should be impossible
	}

	let msg = text.substring(
		matches[1].length + common.prefix.length
	).trim();
	if (!msg) msg = 'malformed yell command';

	return msg;
}

function getDefault(db, type) {
	return new Promise((resolve, reject) => {
		db.get(sql.get, type, (e, row) => {
			if (e) reject(e);
			else resolve(row.RoomId);
		});
	});
}

const matrixIdRegex = /^@(.+):/;
function yellMatrix(bot, roomId, event) {
	getDefault(bot.db, common.DISCORD).then((_data) => {
		const data = JSON.parse(_data);
		const c = bot.discordClient.guilds
			.get(data.guildId).channels
			.get(data.channelId);

		const matches = matrixIdRegex.exec(event.sender);
		if (!matches || matches.length !== 2) {
			throw { message: 'broken matrixID !!' };
		}
		
		c.send('**' + matches[1] + '**: ' + echo(event.content.body));
	}).catch((e) => {
		bot.matrixClient.sendMessage(roomId, {
			msgtype: 'm.text',
			body: e.message ? e.message : JSON.stringify(e)
		});
	});
}

function yellDiscord(bot, message) {
	getDefault(bot.db, common.MATRIX).then((id) => {
		bot.matrixClient.sendMessage(id, {
			msgtype: 'm.text',
			body: message.author.username + ': ' + echo(message.content)
		});
	}).catch((e) => {
		message.channel.send(e.message ? e.message : JSON.stringify(e));
	});
}

exports.yell = common.switch(yellMatrix, yellDiscord);
