(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.factory('StockService',StockService);
		
	StockService.$inject = ['$http','$q'];
	
	function StockService($http,$q){
		var service = {};
		
		
		service.GetAllStocks = GetAllStocks;		

		function GetAllStocks(){
			return $http.get('stocks/getAllStocks');
		}
			
		//PURCHASES
		service.GetStockPurchasesByUser = GetStockPurchasesByUser;
		service.InsertPurchase = InsertPurchase;
		service.DeletePurchase = DeletePurchase;
		service.EditPurchase = EditPurchase;
		service.ProcessPurchaseItemProperties = ProcessPurchaseItemProperties;
		
		function GetStockPurchasesByUser(userID){
			return $http.post('stocks/getPurchases',{id:userID});
		}
		
		function InsertPurchase(purchase){
			return $http.post('stocks/insertPurchase',{purchase});
		}
		
		function DeletePurchase(purchaseID){
			return $http.post('stocks/deletePurchase',{purchaseID:purchaseID});
		}
		
		function EditPurchase(purchase){
			return $http.post('stocks/editPurchase',{purchase});
		}
		
		function ProcessPurchaseItemProperties(purchases){
			var deferred = $q.defer();
			var newPurchases = [];
			for(var i = 0; i < purchases.length; i++){
				newPurchases[i] = {};
				newPurchases[i].id = purchases[i].purchase_id;
				newPurchases[i].date = purchases[i].date_purchased;
				newPurchases[i].stock = purchases[i].stock;
				newPurchases[i].stock_name = purchases[i].stock_name;
				newPurchases[i].volume = purchases[i].volume;
				newPurchases[i].price = purchases[i].purchased_price;
				newPurchases[i].last_price = purchases[i].last_price;
				newPurchases[i].commission = purchases[i].purchase_commission;
			}
			deferred.resolve(newPurchases);
			return deferred.promise;
		}

		//SALES		
		service.InsertSale = InsertSale;
		service.EditSale = EditSale;
		service.DeleteSale = DeleteSale;
		service.GetStockSalesByUser = GetStockSalesByUser;
		service.ProcessSaleItemProperties = ProcessSaleItemProperties;
		
		function GetStockSalesByUser(userID){
			return $http.post('stocks/getSales',{id:userID});
		}
		
		function InsertSale(sale){
			return $http.post('stocks/insertSale',{sale});
		}
		
		function EditSale(sale){
			return $http.post('stocks/editSale',{sale});
		}
		
		function DeleteSale(saleID){
			return $http.post('stocks/deleteSale',{saleID:saleID});
		}
		
		function GetStockSalesByStock(stockID,userID){
			
		}
				
		function ProcessSaleItemProperties(sales){
			var deferred = $q.defer();
			var newSales = [];
			for(var i = 0; i < sales.length; i++){
				newSales[i] = {};
				newSales[i].id = sales[i].sale_id;
				newSales[i].date = sales[i].date_sold;
				newSales[i].stock = sales[i].stock;
				newSales[i].stock_name = sales[i].stock_name;
				newSales[i].volume = sales[i].volume;
				newSales[i].price = sales[i].sale_price;
				newSales[i].last_price = sales[i].last_price;
				newSales[i].commission = sales[i].sale_commission;
			}
			deferred.resolve(newSales);
			return deferred.promise;
		}
		
		
		//To be completed, group purchases together, average their prices
		function GroupStockPurchasesByStocks(stocks){
			var newStockArray = [];
			for(i = 0; i < stocks.length; i++){
				
			}
		}
		
		return service;
	}
})();