const common = require('./common.js');

const sql = {
	insert: `
		INSERT INTO [PrivilegedUser] ([UserType], [UserId])
			SELECT ?, ?
			WHERE NOT EXISTS (
				SELECT 1 FROM [PrivilegedUser]
				WHERE [UserId] = ?
			);`
};

// TODO: i wana do a `escalate @tom` thing where privileged users
// can add other privileged users, but for now, bootstrap + comment out 
// is enough

function escalateMatrix(bot, roomId, event) {

	bot.matrixClient.sendMessage(roomId, {
		msgtype: 'm.text',
		body: 'fat chance, ask bulb'
	});

	/*
	bot.db.run(sql.insert, common.MATRIX, event.sender, event.sender, (e) => {
		const msg = e ? 'database error!' : 'escalated';
		bot.matrixClient.sendMessage(roomId, {
			msgtype: 'm.text',
			body: msg
		});
	});
	*/
}

function escalateDiscord(bot, message) {
	
	message.channel.send('fat chance, ask bulb');

	/*
	bot.db.run(sql.insert, common.DISCORD, message.author.id, message.author.id, (e) => {
		const msg = e ? 'database error!' : 'escalated';
		message.channel.send(msg);
	});
	*/
}

exports.escalate = common.switch(escalateMatrix, escalateDiscord);
