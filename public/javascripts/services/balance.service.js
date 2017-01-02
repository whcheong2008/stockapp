(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.factory('BalanceManagementService',BalanceManagementService);
	
	BalanceManagementService.$inject = ['$http'];
	function BalanceManagementService($http){
		var service = {};
		
		function RetrieveAllDepositsByUser(id){
			return $http.post('balance/getDepositsByUser',{id:userID});
		}
		
		return service;
	}
})();