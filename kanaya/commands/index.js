const common = require('./common.js');
const echo = require('./echo.js').echo;
const escalate = require('./escalate.js').escalate;
const setDefault = require('./default.js').setDefault;
const yell = require('./yell.js').yell;

exports.regex = common.regex; 
exports.MATRIX = common.MATRIX;
exports.DISCORD = common.DISCORD;

exports.list = {
	echo,
	escalate,
	'set-default': setDefault,
	yell
};
