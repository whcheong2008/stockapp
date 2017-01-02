var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/validate', function(req, res, next) {
	var db = req.db;
	var username = req.body.username;
	var password = req.body.password;
	db.getConnection(function(err,conn){
		conn.query('select * from users where username = ? and pass = ?',[username,password], function(err,rows){
			res.json(rows);
			conn.release();
		});
	});
});

router.post('/retrieveCurrentBalanceByUser',function(req, res, next){
	var db = req.db;
	var userID = req.body.id;
	db.getConnection(function(err,conn){
		conn.query('select current_balance from users where id = ?',[userID],function(err,rows){
			res.json(rows);
			conn.release();
		});
	});
});

module.exports = router;
