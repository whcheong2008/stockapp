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
		
		service.ComputePurchasePriceForSale = ComputePurchasePriceForSale;
		
		function ComputePurchasePriceForSale(sale,sales,purchases){
			var deferred = $q.defer();
			var stockID = sale.stock;
			var stockSales = [];
			var stockPurchases = [];
			var value = 0;
			PortfolioService.ExtractStockTransactionsFromList(stockID,stockPurchases,purchases);
			PortfolioService.ExtractStockTransactionsFromList(stockID,stockSales,sales);
			$q.all({ss:stockSales,sp:stockPurchases}).then(function(resolutions){
				GetSaleQuantityUpToDate(sale.id,sale.date,resolutions.ss).then(function(qty){
					GetPurchaseLocAndRemainQtyFromSaleQty(qty,resolutions.sp).then(function(item){
						if(sale.volume <= item.qty){
							value = sale.volume * resolutions.sp[item.num].price;
						}else{
							value = item.qty * resolutions.sp[item.num].price;
						}
						var remainderQty = sale.volume - item.qty;
						for(var i = item.num+1 ; i < resolutions.sp.length; i++){
							if(resolutions.sp[i].volume >= remainderQty && remainderQty > 0){
								value += remainderQty * resolutions.sp[i].price;
							}if(resolutions.sp[i].volume < remainderQty && remainderQty > 0){
								value += resolutions.sp[i].volume * resolutions.sp[i].price;
								remainderQty = remainderQty - resolutions.sp[i].volume;
							}
							if(remainderQty <= 0){
								break;
							}
						}
						var price = value/sale.volume;
						deferred.resolve(price);					
					});
				});
			});
			return deferred.promise;
		}
		
		function GetSaleQuantityUpToDate(saleID,saleDate,sales){
			var deferred = $q.defer();
			var qty = 0;
			for(var i =0; i< sales.length; i++){
				if(saleDate >= sales[i].date && saleID != sales[i].id){
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
			if(currentQty != 0 ){
				for(var i = 0; i < purchases.length; i++){
					currentQty = currentQty - purchases[i].volume;
					if(currentQty <= 0){
						item.num = i;
						item.qty = -currentQty;
						break;
					}			
				}
			}
			deferred.resolve(item);
			return deferred.promise;
		}
		
		return service;
		
	}
	
})();