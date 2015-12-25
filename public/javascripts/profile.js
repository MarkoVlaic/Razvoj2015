var profileApp = angular.module("ProfileApp",['ngSanitize']);

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
	var username = document.getElementById('username').value;
	$http.post('/getUserObject',{username:username}).success(function(data){
		$scope.tasksToSolve = data.tasksToSolve;
		console.log('data',data.tasksToSolve);
	});
});

profileApp.controller("SolutionsController",function($scope,$http){
	var username = document.getElementById('username').value;
	$http.post('/getUserObject',{username}).success(function(data){
		$scope.solutions = data.solved;
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

profileApp.controller('MyTasksController',function($scope,$http,$sce){
	var username = document.getElementById('username').value;
	console.log('username',username);
	$scope.authenticated = false;
	$http.post('/getUserObject',{username:'req'}).success(function(data){
		console.log('data.username',data.username);
		if(data.username == username){
			$scope.authenticated = true;
		}
	});
	$http.post('/getUserObject',{username:username}).success(function(data){
		console.log('Data',data.usersTasks);
		$scope.usersTasks = data.usersTasks.reverse();
		/*htmlDesc = [];
		angular.forEach($scope.usersTasks,function(value){
			var newValue = '<h3>' + value + '</h3>'
			this.push({value:newValue});
		},htmlDesc);
		$scope.htmlDesc = htmlDesc;
		console.log('Html desc',htmlDesc);*/
		$scope.htmlDesc = '<h3>I should be desc</h3>'
	});

});