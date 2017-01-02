(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.controller('StockController',StockController);
	
	StockController.$inject = ['StockService','$rootScope','ngDialog','$scope','PortfolioService','$q'];
	
	function StockController(StockService,$rootScope,ngDialog,$scope,PortfolioService,$q){
		var stockCtrl = this;
		
		CreatePortfolio();
		
		stockCtrl.ListPurchases = ListPurchases;
		stockCtrl.ListSales = ListSales;
		stockCtrl.OpenAddTransactionForm = OpenAddTransactionForm;
		
		function CreatePortfolio(){
			$q.all([ListPurchases(),ListSales()]).then(function(res){
				PortfolioService.GeneratePortfolio(stockCtrl.purchases, stockCtrl.sales).then(function(portfolio){
					stockCtrl.portfolio = portfolio;
				});
			});
		}
		
		function ListPurchases(){
			var deferred = $q.defer();
			var userID = $rootScope.globals.currentUser.id;
			StockService.GetStockPurchasesByUser(userID).then(function(res){
				StockService.ProcessPurchaseItemProperties(res.data).then(function(purchases){
					stockCtrl.purchases = purchases;
					deferred.resolve(stockCtrl.purchases );
				});
			});
			return deferred.promise;
		}
		
		function ListSales(){
			var deferred = $q.defer();
			var userID = $rootScope.globals.currentUser.id;
			StockService.GetStockSalesByUser(userID).then(function(res){
				StockService.ProcessSaleItemProperties(res.data).then(function(sales){
					stockCtrl.sales = sales;
					deferred.resolve(stockCtrl.sales);
				});
			});
			return deferred.promise;
		}

		
		function OpenAddTransactionForm(transactionform,transactiontype){
			$scope.ListPurchases = ListPurchases;
			$scope.ListSales = ListSales;
			$scope.CreatePortfolio = CreatePortfolio;
			$scope.transactionform = transactionform; // 1 is new addition, 2 is editing
			$scope.transactiontype = transactiontype; // 1 is purchase, 2 is sale
			ngDialog.open({template: '/javascripts/stocks/single_transaction.view.html', scope:$scope});
		}
	}
})();