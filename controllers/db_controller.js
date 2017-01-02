var mysql = require('mysql');


exports.startDB = function(){
	return mysql.createPool({
		connectionLimit: 20,
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'stockapp',
	});
}

exports.closeDB = function(db, cb){
	db.end(cb);
}