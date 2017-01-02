(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.factory('BalanceManagementService',BalanceManagementService);
	
	BalanceManagementService.$inject = ['$http'];
	function BalanceManagementService($http){
		var service = {};
		
		service.RetrieveAllDepositsByUser = RetrieveAllDepositsByUser;
		service.RetriveAllWithdrawalsByUser = RetriveAllWithdrawalsByUser;
		
		function RetrieveAllDepositsByUser(userID){
			return $http.post('balance/getBalanceByUserAndType',{id:userID,type:1});
		}
		
		function RetriveAllWithdrawalsByUser(userID){
			return $http.post('balance/getBalanceByUserAndType',{id:userID,type:2});
		}
		
		return service;
	}
})();