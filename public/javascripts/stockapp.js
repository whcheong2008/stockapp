(function(){
	'use strict';
	angular
		.module('stockapp',['ngRoute','ngCookies','ngDialog'])
		.config(config)
		.run(run);
	
	config.$inject = ['$routeProvider'];
	function config($routeProvider){
		$routeProvider
			.when('/',{
				controller: 'LoginController',
				templateUrl: '/javascripts/login/login.view.html',
				controllerAs: 'lgCtrl'
			})
			.when('/stocks',{
				controller: 'StockController',
				templateUrl: '/javascripts/stocks/stocks_purchases.view.html',
				controllerAs: 'stockCtrl'
			});
	}
	
	run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var loggedIn = $rootScope.globals.currentUser;
            if (!loggedIn) {
                $location.path('/');
            }
        });
    }
})();