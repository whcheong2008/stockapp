(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.factory('StatementService',StatementService);
	
	StatementService.$inject = ['PortfolioService','$q'];
	//This service assumes that the purchases and sales are already arranged by date with the first being the earliest
	//for all of the functions which uses the purchases and sales arrays
	function StatementService(PortfolioService,$q){
		var service = {};
		
		function ComputePurchasePriceForSale(sale,sales,purchases){
			var stockID = sale.stock;
			var stockSales = [];
			var stockPurchases = [];
			PortfolioService.ExtractStockTransactionsFromList(stockID,stockPurchases,purchases);
			PortfolioService.ExtractStockTransactionsFromList(stockID,stockSales,sales);
			//$q.all([ss:stockSales,sp:stockPurchases]).then(function(resolutions){
				//to be continued
			//});
		}
		
		function GetSaleQuantityUpToDate(saleID,saleDate,sales){
			var deferred = $q.defer();
			var qty = 0;
			for(var i =0; i< sales.length; i++){
				if(salesDate >= sales[i].date && saleID != sales[i].id){ 
					qty += sales[i].volume;
				}else{
					break;
				}
			}
			deferred.resolve(qty);
			return deferred.promise;
		}
		
		function GetPurchaseLocAndRemainQtyFromSaleQty(saleQty,purchases){
			var deferred = $q.defer();
			var item = {num:0,qty:purchases[0].volume};
			var currentQty = saleQty;
			for(var i = 0; i < purchases.length; i++){
				if(currentQty <= 0){
					break;
				}
				currentQty = currentQty - purchases[i].volume;
				
				
			}
			return deferred.promise;
		}
		
		return service;
		
	}
	
})();