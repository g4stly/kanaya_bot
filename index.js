#!/usr/bin/node

const fs = require('fs');
const Kanaya = require('./kanaya').Kanaya;

const confBuffer = fs.readFileSync('./conf.json');
const conf = JSON.parse(confBuffer);

const error = (prefix) => {
	return (e) => { 
		console.error(prefix + e); 
		process.exit(-1);
	}
}

new Kanaya().init(conf).then(
	(kanaya) => { kanaya.start(); },
	error('failed to initialize: ')
).catch(error('fatal: '));
