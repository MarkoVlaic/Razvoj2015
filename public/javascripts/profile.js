var profileApp = angular.module("ProfileApp",['ngSanitize','hljs']);

profileApp.controller('navController',function($scope,$http){
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
    
});

profileApp.controller('profileHeaderController',function($scope,$http){
    var username = document.getElementById('username').value;
    $http.get('/getProfilePic/'+username).success(function(data){
        $scope.profilePic = data;
    });
});

profileApp.controller("MenuController",function($scope,$http){
	// $scope.activeTab = "Create";
	// $scope.setTasksToSolve = tasksToSolve.setTasksToSolve;
	// $scope.tasks = tasksToSolve.getTasksToSolve;
	var username = document.getElementById('username').value;
	var authenticated = false;
	$http.post('/getUserObject',{username:'req'}).success(function(data){
//		console.log('data.username',data.username);
		if(data.username == username){
			$scope.authenticated = true;
		}
        });
});

profileApp.controller("UploadController",function($scope,$http){
	var username = document.getElementById('username').value;
	$http.post('/getUserObject',{username:username}).success(function(data){
		$scope.tasksToSolve = data.tasksToSolve;
//		console.log('data',data.tasksToSolve);
        });
    });

profileApp.controller("SolutionsController",function($scope,$http,$sce){
	var username = document.getElementById('username').value;
    $scope.showPreview = {};
	$http.post('/getUserObject',{username}).success(function(data){
		$scope.solutions = data.solved;
        angular.forEach($scope.solutions,function(solution){
            $scope.showPreview[solution] = false;
        });
	});
	$scope.indexFunction = function(l,i){
		return l.indexOf(i);
	}

	$scope.splitFunction = function(s,sep){
//		console.log('s',s);
		return s.split(sep);
	}

	$scope.files = {};
    $scope.trust = {};
    
	$scope.previewFile = function(id){
//		console.log('Should preview file',id);
		$http.post('/preview',{name:id}).success(function(data){
			console.log('Data I get is',data);
            var output = '';
            var s = '';
            for(var i=0;i<data.length;i++){
                if(data[i] != ' '){
                    s += data[i];
                }else{
                    output += '<span class="str">' + s + '</span>';
                    s = '';
                }
            }
//			$scope.files[id] = '<pre><code class="python">' + data + '</code></pre>';
            $scope.files[id] = data;
		});
        $scope.trust[id] = function(){
                return $sce.trustAsHtml($scope.files[id]);
            } 
	};

});

profileApp.controller('MyTasksController',function($scope,$http,$sce,$window){
	var username = document.getElementById('username').value;
	var loggedInUser = '';
	console.log('username',username);
	$scope.authenticated = false;
	$scope.solveList = [];
    /*
        -Odrediti je li korisnik ulogiran, srediti listu 
        -Odrediti zadatke za dodavanje, odnosno micanje s liste
    */
	$http.post('/getUserObject',{username:'req'}).success(function(data){
//		console.log('data.username',data.username);
		loggedInUser = data.username;
		$scope.loggedInUser = loggedInUser;
		if(data.username == username){
			$scope.authenticated = true;
		}
		for (var i = 0; i < data.tasksToSolve.length; i++) {
			$scope.solveList.push(data.tasksToSolve[i].title + data.tasksToSolve[i].author);
		};
//		console.log('Solve list',$scope.solveList);
	});
	/*
    -Postaviti likeove i komentare za zadatke
    */
    $scope.showComments = {};
    
	$http.post('/getUserObject',{username:username}).success(function(data){
		console.log('usersTasks',data.usersTasks);
		// $scope.usersTasks = data.usersTasks.reverse();
		$scope.usersTasks = [];
		$scope.likes = {};
		$scope.liked = {};
        $scope.comments = {};
		// console.log('Data.usersTasks'.data.usersTasks);
		angular.forEach(data.usersTasks.reverse(),function(task){
			console.log('Task',task);
            $scope.showComments[task] = false;
			$http.get('/loadTask/'+task).success(function(t){
				$scope.usersTasks.push(t);
				$scope.likes[t.title] = t.likedBy.length;
				$scope.liked[t.title] = (t.likedBy.indexOf(loggedInUser) != -1);
				angular.forEach(t.comments,function(c){
                    console.log('Comment',c);
                    $http.get('/loadComment/'+c).success(function(d){
                        $scope.comments[c] = d;
                    });
                });
                
			});
		});
//        $scope.$broadcast('commentEvent');
	});
    /*
        -Funkcija za dodavanje zadatka na listu za rjesavanje
    */
	$scope.addTask = function(task){
		var parameters = {title:task.title,author:task.author};
		console.log('These are the parameters',parameters);
		$http.post('/addTaskToSolve',parameters).success(function(data){
			$window.location.reload();
		});
	}
    /*
        -Funkcija za like-anje zadatka
    */
	$scope.likeTask = function(id){
		$http.get('/likeTask/'+id+'-'+loggedInUser).success(function(data){
			console.log('Task liked',data);
			$scope.likes[id.split('-')[0]] = data; 
			$scope.liked[id.split('-')[1]] = !$scope.liked[id.split('-')[1]];
			console.log($scope.liked);
			$scope.$broadcast('likeEvent');
		});
	}
    /*
        -Funkcija za komentiranje zadatka
    */
    $scope.commentTask = function(taskId){
            var content = document.getElementById(taskId).value;
            $http.post('/commentTask',{content:content,author:$scope.loggedInUser,taskId:taskId}).success(function(data){
                console.log(data);
//                $scope.$broadcast('commentEvent');
                $scope.updateComments(taskId);
                $scope.showComments[taskId] = true;
            });
        }
        
    /*
        -Funkcija za update zadataka
    */
    
    $scope.updateComments = function(taskId){
        var contentInput = document.getElementById(taskId);
        contentInput.value = '';
        $http.get('/loadTask/'+taskId).success(function(task){
            angular.forEach(task.comments,function(comment){
                $http.get('/loadComment/'+comment).success(function(c){
                    $scope.comments[comment] = c;
                    console.log('Comments now',$scope.comments);
                });
            });
        });
        
        $http.post('/getUserObject',{username:username}).success(function(data){
            console.log('User object I get is',data);
            $scope.usersTasks = [];
            angular.forEach(data.usersTasks.reverse(),function(task){
                $http.get('/loadTask/'+task).success(function(t){
                    $scope.usersTasks.push(t);
                });
            });
        });
    }
    
    /*
        -Funkcija za micanje komentara
    */
    $scope.removeComment = function(commentId,taskId){
        $http.post('/removeComment',{commentId:commentId,taskId:taskId}).success(function(data){
            $scope.updateComments(taskId);
        });
    }
    
    $scope.sendNotification = function(type,reciever,object){
        var sender = $scope.loggedInUser;
<<<<<<< HEAD
        var s = object.split('-')[0] == 'Task'? 'your ' + object.split('-')[1] +' task' : 'you'
=======
        var s = object.split('-')[0] == '<a' '>' + 'Task</a>'? 'your task' : 'you'
>>>>>>> 3f959031fe22f536723d4c80bcfd298579ab2b81
        var content = '<a href="/' + sender + '">' + sender + '</a>' + ' - ' + type + 'd ' + s;
        var form = {type:type,content:content,sender:sender,reciever:reciever,object:object};
        $http.post('/addNotification',form).success(function(data){
            
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

