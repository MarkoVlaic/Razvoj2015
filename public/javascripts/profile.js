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

profileApp.controller("MenuController",function($scope,$http){
	// $scope.activeTab = "Create";
	// $scope.setTasksToSolve = tasksToSolve.setTasksToSolve;
	// $scope.tasks = tasksToSolve.getTasksToSolve;
	var username = document.getElementById('username').value;
	var authenticated = false;
	$http.post('/getUserObject',{username:'req'}).success(function(data){
		console.log('data.username',data.username);
		if(data.username == username){
			$scope.authenticated = true;
		}
	});
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

	$scope.files = {};

	$scope.previewFile = function(id){
		console.log('Should preview file',id);
		$http.post('/preview',{name:id}).success(function(data){
			console.log('Data I get is',data);
			$scope.files[id] = '<p>' + data + '</p>';
		});
	};

});

profileApp.controller('MyTasksController',function($scope,$http,$sce,$window){
	var username = document.getElementById('username').value;
	console.log('username',username);
	$scope.authenticated = false;
	$scope.solveList = [];
	
	$http.post('/getUserObject',{username:'req'}).success(function(data){
		console.log('data.username',data.username);
		if(data.username == username){
			$scope.authenticated = true;
		}
		for (var i = 0; i < data.tasksToSolve.length; i++) {
			$scope.solveList.push(data.tasksToSolve[i].title + data.tasksToSolve[i].author);
		};
		console.log('Solve list',$scope.solveList);
	});
	
	$http.post('/getUserObject',{username:username}).success(function(data){
		console.log('Data',data.usersTasks);
		$scope.usersTasks = data.usersTasks.reverse();
	});

	$scope.addTask = function(task){
		var parameters = {title:task.title,author:task.author};
		console.log('These are the parameters',parameters);
		$http.post('/addTaskToSolve',parameters).success(function(data){
			console.log('Reload the fucking window');
			$window.location.reload();
		});
	}

});