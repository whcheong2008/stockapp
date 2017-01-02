(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.controller('StockController',StockController);
	
	StockController.$inject = ['StockService','$rootScope','ngDialog','$scope','PortfolioService','$q'];
	
	function StockController(StockService,$rootScope,ngDialog,$scope,PortfolioService,$q){
		var stockCtrl = this;
		
		
		stockCtrl.OpenAddTransactionForm = OpenAddTransactionForm;
		
		$q.all([StockService.UpdatePurchaseListInApp($rootScope.globals.currentUser.id),
				StockService.UpdateSaleListInApp($rootScope.globals.currentUser.id)
		]).then(function(res){
			stockCtrl.purchases = $rootScope.globals.purchaseList;
			stockCtrl.salesList = $rootScope.globals.salesList;
		});
		
		$scope.$watch(function(){
			return $rootScope.globals.purchaseList;
		},function(){
			stockCtrl.purchases = $rootScope.globals.purchaseList;
			if(stockCtrl.sales != undefined){
				CreatePortfolio();
			}
		},true);
		
		$scope.$watch(function(){
			return $rootScope.globals.salesList;
		},function(){
			stockCtrl.sales = $rootScope.globals.salesList;
			if(stockCtrl.purchases != undefined){
				CreatePortfolio();
			}
		},true);
		
		function CreatePortfolio(){
			PortfolioService.ProcessPortfolio(stockCtrl.purchases, stockCtrl.sales).then(function(portfolio){				
				stockCtrl.portfolio = portfolio;
			});
		}

		
		function OpenAddTransactionForm(transactionform,transactiontype){
			$scope.transactionform = transactionform; // 1 is new addition, 2 is editing
			$scope.transactiontype = transactiontype; // 1 is purchase, 2 is sale
			ngDialog.open({template: '/javascripts/stocks/single_transaction.view.html', scope:$scope});
		}
	}
})();