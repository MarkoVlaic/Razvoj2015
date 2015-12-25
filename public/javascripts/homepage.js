var homepageApp = angular.module('HomepageApp',[]);

homepageApp.controller('NewsController',function($scope,$http){
	$http.get('/loadHomepageData').success(function(data){
		$scope.news = data;
	});
	// $scope.news = ['Im data'];
});