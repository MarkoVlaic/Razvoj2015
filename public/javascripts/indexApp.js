var indexApp = angular.module('IndexApp',[]);

indexApp.controller('MainController',function($scope){
	$scope.readMore = false;
	$scope.setReadMore = function(b){
		$scope.readMore = b;
	}
});

indexApp.controller('RegisterController',function($scope){
	$scope.userType = '';
	$scope.registerTemplates = {

		'Student':[
			{type:'text',purpose:'username'},
			{type:'text',purpose:'firstname'},
			{type:'text',purpose:'lastname'},
			{type:'password',purpose:'password'},
			{type:'password',purpose:'repeat_password'},
			{type:'email',purpose:'email'},
		],

		'Programmer':[
			{type:'text',purpose:'username'},
			{type:'text',purpose:'firstname'},
			{type:'text',purpose:'lastname'},
			{type:'password',purpose:'password'},
			{type:'password',purpose:'repeat_password'},
			{type:'email',purpose:'email'},
		],

		'Company':[
			{type:'text',purpose:'username'},
			{type:'password',purpose:'password'},
			{type:'password',purpose:'repeat_password'},
			{type:'email',purpose:'email'}
		]

	};
});