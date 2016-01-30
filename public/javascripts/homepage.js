var homepageApp = angular.module('HomepageApp',[]);

homepageApp.controller('NewsController',function($scope,$http){
    $scope.news = []
	$http.post('/loadHomepageData').success(function(data){
		angular.forEach(data,function(task){
            $http.get('/loadTask/'+task).success(function(t){
                $scope.news.push(t);
                console.log(t);
            });
        });
	});
    
    function calculateDayOffset(date)
    {
        var dayFormula = 1000*60*60*24;
        return Math.round(new Date().getTime()/dayFormula - date.getTime()/dayFormula);
    }
	// $scope.news = ['Im data'];
});