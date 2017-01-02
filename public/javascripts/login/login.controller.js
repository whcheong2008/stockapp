(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.controller('LoginController',LoginController);
		
	LoginController.$inject = ['AuthenticationService','$location','$rootScope'];
	function LoginController(AuthenticationService,$location,$rootScope){
		var lgCtrl = this;
		lgCtrl.Login = Login;
		lgCtrl.Logout = Logout;
		InstantiateVariables();
		function Login(){
			AuthenticationService.AuthenticateUser(lgCtrl.username,lgCtrl.password, function(response){
				if(response.success){
					$location.path('/stocks');
				}else{
					lgCtrl.failure = "Username/Password incorrect";
				}
			});
		}
		
		function InstantiateVariables(){
			$rootScope.globals.purchaseList = [];
			$rootScope.globals.salesList = [];
		}
		
		function Logout(){
			AuthenticationService.ClearCredentials();
			$location.path('/');
		}
	}
})();