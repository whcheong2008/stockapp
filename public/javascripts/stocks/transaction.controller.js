(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.controller('TransactionController', TransactionController);
		
	
	TransactionController.$inject = ['StockService','$scope','$rootScope','$q','PortfolioService'];
	
	function TransactionController(StockService,$scope,$rootScope,$q,PortfolioService){
		var transCtrl = this;
		StockService.GetAllStocks().then(function(res){
			transCtrl.stocks = res.data;	
		});
		if($scope.transactiontype == 1){
			$scope.txntype = "Purchase";
		}else{
			$scope.txntype = "Sale";
		}
		//check transaction form, 1 for add, 2 for edit
		if($scope.transactionform == 2){
			LoadTransaction($scope.transactionToEdit);			
		}
		
		$scope.$watch('transCtrl.qty * transCtrl.price',function(value){
			transCtrl.value = value;
		});
		
		transCtrl.SubmitTransaction = SubmitTransaction;
		
		function AddTransaction(){
			ProcessTransaction().then(function(transaction){
				if($scope.transactiontype == 1) {
					StockService.InsertPurchase(transaction).then(function(res){
						StockService.UpdatePurchaseListInApp($rootScope.globals.currentUser.id);
					});
				}
				if($scope.transactiontype == 2){
					StockService.InsertSale(transaction).then(function(res){
						StockService.UpdateSaleListInApp($rootScope.globals.currentUser.id);
					})
				}
			});		
		}
		
		function SubmitTransaction(){
			if($scope.transactionform == 1){
				AddTransaction();
			}
			if($scope.transactionform == 2){
				EditTransaction();
			}
			$scope.closeThisDialog();
		}
		
		function EditTransaction(){
			ProcessTransaction().then(function(transaction){
				transaction.id = $scope.transactionToEdit.id;
				if($scope.transactiontype == 1) {				
					StockService.EditPurchase(transaction).then(function(res){
						StockService.UpdatePurchaseListInApp($rootScope.globals.currentUser.id);
					});
				}
				if($scope.transactiontype == 2) {
					StockService.EditSale(transaction).then(function(res){
						StockService.UpdateSaleListInApp($rootScope.globals.currentUser.id);
					});
				}
			});
		}
		
		function ProcessTransaction(){
			var deferred = $q.defer();
			var transaction = {};
			var date = new Date(transCtrl.date);
			date = date.getTime()- 1000*60*date.getTimezoneOffset();
			transaction.date = new Date(date);
			transaction.stock = transCtrl.stock;
			transaction.qty = transCtrl.qty;
			transaction.price = parseFloat(transCtrl.price);
			var comms = 0;
			if(transCtrl.value != "" && transCtrl.value != null ){
				comms = transCtrl.value - transCtrl.qty * transCtrl.price;
			}
			transaction.comms = comms;
			transaction.user = $rootScope.globals.currentUser.id;
			deferred.resolve(transaction);
			return deferred.promise;
		}
		
		function LoadTransaction(transaction){
			transCtrl.date = transaction.date;	
			transCtrl.stock = transaction.stock;			
			$scope.stockSelected = transCtrl.stock;
			transCtrl.qty = transaction.volume;
			transCtrl.price = transaction.price;
			transCtrl.value = transaction.volume * transaction.price + transaction.commission;
		}
		
	}	
})();