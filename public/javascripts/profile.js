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
			$scope.files[id] = '<pre><code>' + data + '</code></pre>';
		});
	};

});

profileApp.controller('MyTasksController',function($scope,$http,$sce,$window){
	var username = document.getElementById('username').value;
	var loggedInUser = '';
	console.log('username',username);
	$scope.authenticated = false;
	$scope.solveList = [];
	$http.post('/getUserObject',{username:'req'}).success(function(data){
		console.log('data.username',data.username);
		loggedInUser = data.username;
		$scope.loggedInUser = loggedInUser;
		if(data.username == username){
			$scope.authenticated = true;
		}
		for (var i = 0; i < data.tasksToSolve.length; i++) {
			$scope.solveList.push(data.tasksToSolve[i].title + data.tasksToSolve[i].author);
		};
		console.log('Solve list',$scope.solveList);
	});
	
	$http.post('/getUserObject',{username:username}).success(function(data){
		console.log('usersTasks',data.usersTasks);
		// $scope.usersTasks = data.usersTasks.reverse();
		$scope.usersTasks = [];
		$scope.likes = {};
		$scope.liked = {};
		// console.log('Data.usersTasks'.data.usersTasks);
		angular.forEach(data.usersTasks.reverse(),function(task){
			console.log('Task',task);
			$http.get('/loadTask/'+task).success(function(t){
				$scope.usersTasks.push(t);
				$scope.likes[t.title] = t.likedBy.length;
				$scope.liked[t.title] = (t.likedBy.indexOf(loggedInUser) != -1);
				console.log('Pushing a task');
				console.log('Liked object',$scope.liked);
			});
		});
	});

	$scope.addTask = function(task){
		var parameters = {title:task.title,author:task.author};
		console.log('These are the parameters',parameters);
		$http.post('/addTaskToSolve',parameters).success(function(data){
			console.log('Reload the fucking window');
			$window.location.reload();
		});
	}

	$scope.likeTask = function(id){
		$http.get('/likeTask/'+id+'-'+loggedInUser).success(function(data){
			console.log('Task liked',data);
			$scope.likes[id.split('-')[0]] = data; 
			$scope.liked[id.split('-')[1]] = !$scope.liked[id.split('-')[1]];
			console.log($scope.liked);
			$scope.$broadcast('likeEvent');
		});
	}

});


//directives
profileApp.directive('ngLike',function(){
	return {
		restrict:'A',
		scope:{
			ngTaskId:'@'
		},
		template:'<label>Likes:{{likes}}</label>',
		controller:['$scope','$http',function($scope,$http){
			//Do the controller here
			$scope.setLikes = function(id){
				$http.get('/loadTask/'+id).success(function(data){
					$scope.likes = data.likedBy.length;
				});
			}
			$scope.$on('likeEvent',function(){
				console.log('This is like event');
				$scope.setLikes($scope.ngTaskId);
			});
		}],
		link: function(scope,iElement,iAttrs,ctrl){
			scope.setLikes(iAttrs.ngTaskId);
			scope.$watch('likes',function(newVal){
				console.log('I noticed the change',newVal);
			});
		}
	}
});

profileApp.directive('ngTaskId',function(){
	return {
		controller:function($scope){}
	}
});

profileApp.directive('ngLikeButton',function(){
	return{
		restrict:'A',
		scope:{
			ngTaskId:"@"
		},
		link: function(scope,iElement){
			iElement.bind('click',function(e){
				// angular.element(e.target).siblings('#'+scope.ngTaskId).trigger();
				// scope.$broadcast('likeEvent');
			});
		},
	}
});