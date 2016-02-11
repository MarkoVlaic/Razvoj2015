var homepageApp = angular.module('HomepageApp',['ngSanitize']);

homepageApp.controller('NewsController',function($scope,$http){
    $scope.news = []
    $http.post('/loadHomepageData').success(function(data){
        angular.forEach(data,function(task){
            $http.get('/loadTask/'+task).success(function(t){
                //TODO: Zavrsiti provjeravanje vremenske razlike
                t.more=false;
                $scope.news.push(t);

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
homepageApp.controller('navController',function($scope,$http){
    $http.post('/getUserObject',{username:'req'}).success(function(data){
        $scope.loggedInUser = data.username;
        $scope.notifications = [];
        console.log('Notifiications',data.notifications);
        angular.forEach(data.notifications,function(notification){
        console.log('Single notification',notification);
        $http.get('/loadNotification/'+notification).success(function(d){
                $scope.notifications.push(d);
            });
        });
        
    });
    
    $scope.searchResults = [];
    
    $scope.search = function(){
        var toSearch = document.getElementById('search').value;
        /*
        $http.post('/search',{search:toSearch}).success(function(data){
//            
            $scope.searchResults = data;
        });
        **/
    }
    
});