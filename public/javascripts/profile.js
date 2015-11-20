var profileApp = angular.module("ProfileApp",[]);

profileApp.factory('tasksToSolve',function(){
	var tasksToSolve = [];
	var service = {};

	service.setTasksToSolve = function(l){
		console.log('Setting tasks to solve',l);
		tasksToSolve = l;
	}

	service.getTasksToSolve = function(){
		console.log('Getting thesee tasks',tasksToSolve);
		return tasksToSolve;
	}

	return service;

});

profileApp.controller("MenuController",function($scope,tasksToSolve){
	// $scope.activeTab = "Create";
	// $scope.setTasksToSolve = tasksToSolve.setTasksToSolve;
	// $scope.tasks = tasksToSolve.getTasksToSolve;
});

profileApp.controller("UploadController",function($scope,$http){
	$http.get('/getTasksToSolve').success(function(data){
		$scope.tasksToSolve = data;
		console.log('data',data);
	});
});

profileApp.controller("SolutionsController",function($scope,$http){
	$http.get('/getSolutions').success(function(data){
		$scope.solutions = data;
	});

	$scope.indexFunction = function(l,i){
		return l.indexOf(i);
	}

	$scope.splitFunction = function(s,sep){
		console.log('s',s);
		return s.split(sep);
	}

	$scope.previewFile = function(id){
		$http.post('/preview',{name:id}).success(function(data){
			$scope.file = data;
		});
	};

});

profileApp.controller('MyTasksController',function($scope,$http){
	$http.get('/getUsersTasks').success(function(data){
		console.log('Data',data);
		$scope.usersTasks = data.reverse();	
	});

});