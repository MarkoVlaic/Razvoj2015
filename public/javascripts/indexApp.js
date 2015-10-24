var indexApp = angular.module('IndexApp',[]);

indexApp.controller('RegisterController',function($scope){
	$scope.userType = 'Student';
	$scope.registerTemplates = {

		'Student':[
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