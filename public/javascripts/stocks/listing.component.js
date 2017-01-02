(function(){
	'use strict';
	
	var transactionListing = {
		bindings: {
			list: '=',
			transactiontype: '<'
		},
		templateUrl: '/javascripts/stocks/listing.view.html',
		controller: ListingController,
		controllerAs: 'listCtrl'
	};		
	
	angular
		.module('stockapp')
		.component('transactionListing',transactionListing);

	ListingController.$inject = ['StockService','$scope','ngDialog','$rootScope'];
	
	function ListingController(StockService,$scope,ngDialog,$rootScope){
		var listCtrl = this;
		listCtrl.OpenDeleteTransaction = OpenDeleteTransaction;
		listCtrl.OpenEditTransactionForm = OpenEditTransactionForm;
		
		
		function OpenEditTransactionForm(id){
			$scope.transactionform = "2"; //2 is fixed for edit forms (1 is for addition)
			$scope.UpdateTransactionList = UpdateTransactionList;
			$scope.transactiontype = listCtrl.transactiontype;
			for(var i = 0; i < listCtrl.list.length; i++){
				if(listCtrl.list[i].id == id){
					$scope.transactionToEdit = listCtrl.list[i];	
				}
			}
			ngDialog.open({template: '/javascripts/stocks/single_transaction.view.html', scope:$scope});		
		}
		
		function OpenDeleteTransaction(id){
			$scope.transactiontype = listCtrl.transactiontype;
			if(confirm("Are you sure to delete this transaction?")){
				if($scope.transactiontype == 1){
					StockService.DeletePurchase(id).then(function(res){
						UpdateTransactionList();
					});
				}
				if($scope.transactiontype == 2){
					StockService.DeleteSale(id).then(function(res){
						UpdateTransactionList();
					});
				}
			}
		}
		
		function UpdateTransactionList(){
			var userID = $rootScope.globals.currentUser.id;
			if($scope.transactiontype == 1) { //1 for purchases	
				StockService.GetStockPurchasesByUser(userID).then(function(res){
					StockService.ProcessPurchaseItemProperties(res.data).then(function(purchases){
						listCtrl.list = purchases;
					});
				});
			}
			if($scope.transactiontype == 2){ //2 for sales
				StockService.GetStockSalesByUser(userID).then(function(res){
					StockService.ProcessSaleItemProperties(res.data).then(function(sales){
						listCtrl.list = sales;
					});
				});
			}
		}
	}
})();