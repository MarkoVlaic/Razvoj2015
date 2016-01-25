var homepageApp = angular.module('HomepageApp',[]);

homepageApp.controller('NewsController',function($scope,$http){
	$http.post('/loadHomepageData').success(function(data){
		$scope.news = data;
        console.log('data',data);
	});
	// $scope.news = ['Im data'];
});