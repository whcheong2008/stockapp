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
						StockService.UpdatePurchaseListInApp($rootScope.globals.currentUser.id);
					});
				}
				if($scope.transactiontype == 2){
					StockService.DeleteSale(id).then(function(res){
						StockService.UpdateSaleListInApp($rootScope.globals.currentUser.id);
					});
				}
			}
		}
	}
})();