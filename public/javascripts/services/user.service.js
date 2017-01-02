(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.factory('UserService',UserService);
	
	UserService.$inject = ['$http','$q'];
	function UserService($http,$q){
		var service = {};
		
		service.RetrieveUser = RetrieveUser;
		
		function RetrieveUser(username,password){
			return $http.post('users/validate',{'username':username,'password':password});
		}
		
		return service;
	}
})();