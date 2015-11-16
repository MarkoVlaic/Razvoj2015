var profileApp = angular.module("OtherProfileApp",[]);

profileApp.controller('tasksController',function($scope,$http){
	$http.get('/getUserSolved').success(function(data){
		$scope.userSolved = [];
		for(d in data){
			console.log(data[d]);
			$scope.userSolved.push(data[d].split('-')[1]);	
		}
		var d = document.getElementsByClassName('task');
		console.log(d);
		for(i in d){
			console.log(i.id);
		}
	});
});