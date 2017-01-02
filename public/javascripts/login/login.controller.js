(function(){
	'use strict';
	
	angular
		.module('stockapp')
		.controller('LoginController',LoginController);
		
	LoginController.$inject = ['AuthenticationService','$location'];
	function LoginController(AuthenticationService,$location){
		var lgCtrl = this;
		lgCtrl.Login = Login;
		lgCtrl.Logout = Logout;
		
		function Login(){
			AuthenticationService.AuthenticateUser(lgCtrl.username,lgCtrl.password, function(response){
				if(response.success){
					$location.path('/stocks');
				}else{
					lgCtrl.failure = "Username/Password incorrect";
				}
			});
		}
		
		function Logout(){
			AuthenticationService.ClearCredentials();
			$location.path('/');
		}
	}
})();