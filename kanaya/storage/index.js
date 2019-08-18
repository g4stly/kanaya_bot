const sqlite3 = require('sqlite3');

const sql = {
	getToken: 'SELECT [Token] FROM [SyncToken] WHERE [Valid] = 1;',
	invalidateTokens: 'UPDATE [SyncToken] SET [Valid] = 0 WHERE [Valid] = 1;',
	insertNewToken: 'INSERT INTO [SyncToken] ([Token]) VALUES (?);',

	getFilter: 'SELECT [Filter] FROM [Filter] WHERE [Valid] = 1;',
	invalidateFilters: 'UPDATE [Filter] SET [Valid] = 0 WHERE [Valid] = 1;',
	insertNewFilter: 'INSERT INTO [Filter] ([Filter]) VALUES (?);'
};

function Provider() {
	this.syncToken = null;
	this.filter = null;
	this.db = null;
}

function queryPromise(db, query) {
	return new Promise((resolve, reject) => {
		db.get(query, (err, row) => {
			if (err) reject(err);
			resolve(row);
		});
	});
}

Provider.prototype.init = function(conf) {
	return new Promise((resolve, reject) => {
		this.db = new sqlite3.Database(conf.dbPath);
		this.db.on('open', () => {
			queryPromise(this.db, sql.getToken).then((row) => {
				if (row && row.Token) this.syncToken = row.Token;
				return queryPromise(this.db, sql.getFilter); 
			}).then((row) => {
				if (row && row.Filter) this.filter = JSON.parse(row.Filter);
				resolve();
			}).then(null, (e) => { reject(e); });
		});
	});
}

Provider.prototype.setSyncToken = function(token) {
	if (this.syncToken === token) return;

	this.syncToken = token;
	this.db.serialize(() => {
		this.db.exec(sql.invalidateTokens, (e) => {
			if (e) console.error('\n\n\n' + JSON.stringify(e) + '\n\n');
		});

		if (!this.syncToken) return;

		this.db.run(sql.insertNewToken, this.syncToken, (e) => {
			if (e) console.error('\n\n\n' + JSON.stringify(e) + '\n\n');
		});
	});
}

Provider.prototype.getSyncToken = function(token) {
	return this.syncToken;
}

Provider.prototype.setFilter = function(filter) {
	this.filter = filter;
	this.db.serialize(() => {
		this.db.exec(sql.invalidateFilters, (e) => {
			if (e) console.error('\n\n\n' + JSON.stringify(e) + '\n\n');
		});

		if (!this.filter) return;

		this.db.run(sql.insertNewFilter, JSON.stringify(this.filter), (e) => {
			if (e) console.error('\n\n\n' + JSON.stringify(e) + '\n\n');
		});
	});
}

Provider.prototype.getFilter = function(filter) {
	return this.filter;
}

exports.Provider = Provider;
exports.DB = function(conf) {
	return new sqlite3.Database(conf.dbPath);
}
