const common = require('./common.js');


function echo(text) {
	const matches = common.regex.exec(text);
	if (!matches || matches.length !== 2) {
		return 'echo(): banic!';	// should be impossible
	}

	let msg = text.substring(
		matches[1].length + common.prefix.length
	).trim();
	if (!msg) msg = 'malformed echo command';

	return msg;
}

function matrixEcho(bot, roomId, event) {

	const msg = echo(event.content.body);

	bot.matrixClient.sendMessage(roomId, {
		msgtype: 'm.text',
		body: msg
	});
}

function discordEcho(bot, message) {

	const msg = echo(message.content);

	message.channel.send(msg);
}

exports.echo = common.switch(matrixEcho, discordEcho);
