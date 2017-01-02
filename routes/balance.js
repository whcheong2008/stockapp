var express = require('express');
var router = express.Router();

router.post('/getBalanceByUserAndType',function(req,res,next){
	var db = req.db;
	var userID = req.body.id;
	var type = req.body.type;
	db.getConnection(function(err,conn){
		conn.query('select * from balance_management where user = ? and type = ?',[userID, type], function(err,rows){
			res.json(rows);
			conn.release();
		});
	});
});

module.exports = router;