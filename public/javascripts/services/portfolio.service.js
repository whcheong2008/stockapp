(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.factory('PortfolioService',PortfolioService);
	
	PortfolioService.$inject = ['$q'];
	
	//All lists used in this Service is presumed to be after StockService Properties Processing
	function PortfolioService($q){
		var service = {};
		
		service.ProcessPortfolio = ProcessPortfolio;
		service.ExtractStockTransactionsFromList = ExtractStockTransactionsFromList;
		
		//This method is the overall method that generates the portfolio based on FIFO method
		function GeneratePortfolio(purchases,sales){
			var deferred = $q.defer();
			var finalList = [];
			ArrangeListByDate(purchases).then(function(processedPurchases){
				ArrangeListByDate(sales).then(function(processedSales){
					CreateCompiledStockList(processedPurchases,processedSales).then(function(stockList){
						for(var i = 0; i < stockList.length; i++){
							ComputeStockPosition(stockList[i].stock_id,stockList);
						}
						$q.all(stockList).then(function(list){
							finalList = list;
							deferred.resolve(finalList);
						});
					});
				});
			});
			return deferred.promise;
		}
		
		function ProcessPortfolio(purchases,sales){
			var deferred = $q.defer();
			var finalList = [];
			var originalList = [];
			var j = 0;
			GeneratePortfolio(purchases,sales).then(function(originalList){
				for(var i = 0; i < originalList.length; i++){
					if (originalList[i].position.qty != 0) {
						finalList[j] = originalList [i];
						j++;
					}			
				}	
			});			
			deferred.resolve(finalList);
			return deferred.promise;
		}
		
		//This method computes a stock position based on all Purchases and Sales
		function ComputeStockPosition(stockID,stockList){
			var deferred = $q.defer();
			for(var i = 0; i < stockList.length; i++){
				if(stockID == stockList[i].stock_id){
					var purchaseQty = SumAllTransactionQuantity(stockList[i].purchases);
					var saleQty = SumAllTransactionQuantity(stockList[i].sales);					
					var num = RetainNumber(i);
					
					stockList[i].position = {};
					$q.all({pqty:purchaseQty,sqty:saleQty,number:num}).then(function(resolutions){
						var qty = resolutions.pqty - resolutions.sqty;
						var price = 0;
						if(qty > 0){
							price = EvaluateAveragePrice(qty,stockList[resolutions.number].purchases);
						}
						else if(qty < 0){
							price = EvaluateAveragePrice(-qty,stockList[resolutions.number].sales);
						}
						stockList[resolutions.number].position = {qty: qty, price: price};
					});		
				}
			}
			deferred.resolve(stockList);
			return deferred.promise;
		}
		
		function RetainNumber(i){
			var deferred = $q.defer();
			deferred.resolve(i);
			return deferred.promise;
		}
		
		function EvaluateAveragePrice(qty,list){
			var totalValue = 0;
			var currentQty = qty;
			for(var i = list.length -1; i >= 0; i--){
				if(list[i].volume < currentQty){
					totalValue += list[i].volume * list[i].price;
				}else{
					totalValue += currentQty * list[i].price;
				}
				currentQty = currentQty- list[i].volume;
				if(currentQty <= 0){
					break;
				}
			}
			return totalValue/qty;
		}
		
		function SumAllTransactionQuantity(list){
			var deferred = $q.defer();
			var vol = 0;
			
			for(var i = 0; i < list.length; i++){
				vol += list[i].volume;
			}
			deferred.resolve(vol);
			return deferred.promise;
		}
		
		//This method arrange the list by date
		function ArrangeListByDate(list){
			var deferred = $q.defer();
			var temp;
			for(var i = 0; i < list.length; i++){
				temp = list[i];
				for(var j = i; j < list.length; j++){
					if(list[i].date > list[j].date){
						temp = list[j];
						list[j] = list[i];
						list[i] = temp;
					}
				}
			}
			deferred.resolve(list);
			return deferred.promise;
		}
		
		//This method creates a list for all stocks and transactions tied to them
		function CreateCompiledStockList(purchases,sales){
			var deferred = $q.defer();
			var combinedList = [];
			combinedList.push.apply(combinedList,purchases);
			combinedList.push.apply(combinedList,sales);
			ExtractAllStocks(combinedList).then(function(stockList){
				for(var i =0; i < stockList.length; i++){
					stockList[i].purchases = [];
					stockList[i].sales = [];
					ExtractStockTransactionsFromList(stockList[i].stock_id,stockList[i].purchases,purchases);
					ExtractStockTransactionsFromList(stockList[i].stock_id,stockList[i].sales,sales);					
				}
				deferred.resolve(stockList);
			});
			
			return deferred.promise;
		}
		//This method extract the id and name of the stocks involved in all transactions and returns an array
		function ExtractAllStocks(list){
			var deferred = $q.defer();
			var stockLists = [];
			for(var i = 0; i < list.length; i++){
				var exists = false;
				for(var j = 0; j < stockLists.length; j++){
					if(list[i].stock == stockLists[j].stock_id){
						exists = true;
						break;
					}
				}
				if(!exists){
					stockLists.push({stock_id:list[i].stock,stock_name:list[i].stock_name,last_price:list[i].last_price});
				}			
			}
			deferred.resolve(stockLists);	
			return deferred.promise;
		}
		
		//This method extracts all transactions of a particular stock from a list and places it into a list
		function ExtractStockTransactionsFromList(stockID,mainList,list){
			var deferred = $q.defer();
			for(var i = 0; i < list.length; i++){
				if(list[i].stock == stockID){
					mainList.push(list[i]);
				}
			}
			deferred.resolve(mainList);
			return deferred.promise;
		}
		
		return service;
	}
})();