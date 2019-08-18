const common = require('./common.js');

const sql = {
	delFrom: 'DELETE FROM [DefaultRoom] WHERE [RoomType] = ?;',
	insert: 'INSERT INTO [DefaultRoom] ([RoomType], [RoomId]) SELECT ?, ?;'
};

function setDefault(db, type, roomId) {
	return new Promise((resolve, reject) => {
		db.serialize(() => {

			db.run(sql.delFrom, type, (e) => { if (e) reject(e); });

			db.run(sql.insert, type, roomId, (e) => { 
				if (e) reject(e); 
				else resolve();
			});

		});
	});
}

function matrixSetDefault(bot, roomId, event) {

	common.checkPrivilege(bot.db, event.sender).then((authorized) => {
		if (!authorized) throw { message: 'not authorized' };
		return setDefault(bot.db, common.MATRIX, roomId);
	}).then(() => {
		bot.matrixClient.sendMessage(roomId, {
			msgtype: 'm.text',
			body: 'default set!'
		});
	}).catch((e) => {
		bot.matrixClient.sendMessage(roomId, {
			msgtype: 'm.text',
			body: e.message ? e.message : JSON.stringify(e)
		});
	});
}

function discordSetDefault(bot, message) {

	common.checkPrivilege(bot.db, message.author.id).then((authorized) => {
		if (!authorized) throw { message: 'not authorized' };

		const data = {
			guildId: message.channel.guild.id,
			channelId: message.channel.id
		};

		return setDefault(bot.db, common.DISCORD, JSON.stringify(data));
	}).then(() => {
		message.channel.send('default set!');
	}).catch((e) => {
		message.channel.send(e.message ? e.message : JSON.stringify(e));
	});
}

exports.setDefault = common.switch(matrixSetDefault, discordSetDefault);
