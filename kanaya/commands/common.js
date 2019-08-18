const MATRIX = exports.MATRIX = 1;
const DISCORD = exports.DISCORD = 2;

const prefix = exports.prefix = '.';
const regex = exports.regex = new RegExp(`^\\${prefix}([a-z\-]+)`);

const sql = {
	checkPrivilege: 'SELECT * FROM [PrivilegedUser] WHERE [UserId] = ?;'
}

exports.checkPrivilege = function (db, userId) {
	return new Promise((resolve, reject) => {
		db.get(sql.checkPrivilege, userId, (e, row) => { 
			if (e) reject(e);
			else resolve(row ? true : false);
		});
	});
}

exports.switch = function (matrix, discord) {
	return (p) => { switch(p) {
		case MATRIX: return matrix;
		case DISCORD: return discord;
	}}
}
