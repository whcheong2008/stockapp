var express = require('express');
var router = express.Router();

/* GET purchase listing. */
router.get('/getAllStocks', function(req,res,next){
	var db = req.db;
	db.getConnection(function(err,conn){
		conn.query('select * from stocks', function(err,rows){
			res.json(rows);
			conn.release();
		});
	});
});

router.post('/getPurchases', function(req, res, next) {
	var db = req.db;
	var userid = req.body.id;
	db.getConnection(function(err,conn){
		conn.query('select * from purchases left join stocks on purchases.stock = stocks.stock_id where user = ? ',[userid], function(err,rows){
			res.json(rows);
			conn.release();
		});
	});
});
router.post('/insertPurchase', function(req,res,next){
	var db = req.db;
	var date = req.body.purchase.date;
	var stock = req.body.purchase.stock;
	var qty = req.body.purchase.qty;
	var comms = req.body.purchase.comms;
	var price = req.body.purchase.price;
	var user = req.body.purchase.user;
	db.getConnection(function(err,conn){
		conn.query('insert into purchases (date_purchased,stock,volume,purchase_commission,purchased_price,user) values (?,?,?,?,?,?)',[date,stock,qty,comms,price,user],function(err,result){
			res.json(result);
			conn.release();
		})
	});
});

router.post('/editPurchase',function(req,res,next){
	var db = req.db;
	var id = req.body.purchase.id;
	var date = req.body.purchase.date;
	var stock = req.body.purchase.stock;
	var qty = req.body.purchase.qty;
	var comms = req.body.purchase.comms;
	var price = req.body.purchase.price;
	db.getConnection(function(err,conn){
		conn.query('update purchases set date_purchased = ?, stock = ?,volume = ?,purchase_commission = ?, purchased_price = ? where purchase_id = ? ',[date,stock,qty,comms,price,id],function(err,result){
			res.json(result);
			conn.release();
		});
	});
});

router.post('/deletePurchase',function(req,res,next){
	var db = req.db;
	var purchaseID = req.body.purchaseID;
	db.getConnection(function(err,conn){
		conn.query('delete from purchases where purchase_id = ?', [purchaseID], function(err,result){
			res.json(result);
			conn.release();
		});
	});
});

router.post('/getSales',function(req,res,next){
	var db = req.db;
	var userID = req.body.id;
	db.getConnection(function(err,conn){
		conn.query('select * from stocks_sold left join stocks on stock = stock_id where user = ?',[userID],function(err,rows){
			res.json(rows);
			conn.release();
		});
	});
});

router.post('/getSalesByStock',function(req,res,next){
	var db = req.db;
	var userID = req.body.id;
	var stockID = req.body.stockID;
	db.getConnection(function(err,conn){
		conn.query('select * from stocks_sold left join stocks on stock = stock_id where user = ? and stock = ?',[userID,stockID],function(err,rows){
			res.json(rows);
			conn.release();
		});
	});
});

router.post('/insertSale',function(req,res,next){
	var db = req.db;
	var date = req.body.sale.date;
	var stock = req.body.sale.stock;
	var qty = req.body.sale.qty;
	var comms = req.body.sale.comms;
	var price = req.body.sale.price;
	var user = req.body.sale.user;
	db.getConnection(function(err,conn){
		conn.query('insert into stocks_sold (date_sold,stock,volume,sale_commission,sale_price,user) values (?,?,?,?,?,?)',[date,stock,qty,comms,price,user],function(err,result){
			res.json(result);
			conn.release();
		})
	});
});

router.post('/editSale',function(req,res,next){
	var db = req.db;
	var id = req.body.sale.id;
	var date = req.body.sale.date;
	var stock = req.body.sale.stock;
	var qty = req.body.sale.qty;
	var comms = req.body.sale.comms;
	var price = req.body.sale.price;
	var user = req.body.sale.user;
	db.getConnection(function(err,conn){
		conn.query('update stocks_sold set date_sold = ?, stock = ?, volume = ?, sale_commission = ?, sale_price = ? where sale_id = ? ',[date,stock,qty,comms,price,id],function(err,result){
			res.json(result);
			conn.release();
		})
	});	
});

router.post('/deleteSale',function(req,res,next){
	var db = req.db;
	var saleID = req.body.saleID;
	db.getConnection(function(err,conn){
		conn.query('delete from stocks_sold where sale_id = ?', [saleID], function(err,result){
			res.json(result);
			conn.release();
		});
	});
});
module.exports = router;
