(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.controller('PurchaseController', PurchaseController);
		
	
	PurchaseController.$inject = ['StockService','$scope','$rootScope','$q'];
	
	function PurchaseController(StockService,$scope,$rootScope,$q){
		var purCtrl = this;
		StockService.GetAllStocks().then(function(res){
			purCtrl.stocks = res.data;	
		});
		var checkInitiation = $scope.purchaseForm;
		if(checkInitiation == 2){
			LoadPurchase($scope.purchaseToEdit);
		}
		
		purCtrl.SubmitPurchase = SubmitPurchase;
		
		function AddPurchase(){
			ProcessPurchase().then(function(purchase){
				StockService.InsertPurchase(purchase).then(function(res){
					$scope.ListPurchases();
				});		
			});		
		}
		
		function SubmitPurchase(){
			if(checkInitiation == 1){
				AddPurchase();
			}
			if(checkInitiation == 2){
				EditPurchase();
			}
			$scope.closeThisDialog();
		}
		
		function EditPurchase(){
			ProcessPurchase().then(function(purchase){
				purchase.purchase_id = $scope.purchaseToEdit.purchase_id;
				StockService.EditPurchase(purchase).then(function(res){
					$scope.ListPurchases();
				});		
			});		
		}
		
		function ProcessPurchase(){
			var deferred = $q.defer();
			var purchase = {};
			var date = new Date(purCtrl.date_purchased);
			date = date.getTime()- 1000*60*date.getTimezoneOffset();
			purchase.date_purchased = new Date(date);
			purchase.stock = purCtrl.stock_purchased;
			purchase.qty = purCtrl.qty_purchased;
			purchase.purchasedPrice = parseFloat(purCtrl.purchased_price);
			var comms = 0;
			if(purCtrl.purchased_value != "" && purCtrl.purchased_value != null ){
				comms = purCtrl.purchased_value - purCtrl.qty_purchased * purCtrl.purchased_price;
			}
			purchase.comms = comms;
			purchase.user = $rootScope.globals.currentUser.id;
			deferred.resolve(purchase);
			return deferred.promise;
		}
		
		function LoadPurchase(purchase){
			purCtrl.date_purchased = purchase.date_purchased;
			purCtrl.stock_purchased = purchase.stock;
			$scope.stockSelected = purCtrl.stock_purchased;
			purCtrl.qty_purchased = purchase.volume;
			purCtrl.purchased_price = purchase.purchased_price;
			purCtrl.purchased_value = purchase.volume * purchase.purchased_price + purchase.commission;
		}
	}	
})();