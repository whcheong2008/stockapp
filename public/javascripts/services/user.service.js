(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.factory('UserService',UserService);
	
	UserService.$inject = ['$http'];
	function UserService($http){
		var service = {};
		
		service.RetrieveUser = RetrieveUser;
		
		function RetrieveUser(username,password){
			return $http.post('users/validate',{'username':username,'password':password});
		}
		
		function RetrieveCurrentBalanceByUser(id){
			return $http.post('users/retrieveCurrentBalanceByUser',{id:userID});
		}
		
		return service;
	}
})();