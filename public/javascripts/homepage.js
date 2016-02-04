var homepageApp = angular.module('HomepageApp',[]);

homepageApp.controller('NewsController',function($scope,$http){
    $scope.news = []
	$http.post('/loadHomepageData').success(function(data){
		angular.forEach(data,function(task){
            $http.get('/loadTask/'+task).success(function(t){
                //TODO: Zavrsiti provjeravanje vremenske razlike
                $scope.news.push(t);
                console.log(t);
            });
        });
	});
    
   
	// $scope.news = ['Im data'];
});