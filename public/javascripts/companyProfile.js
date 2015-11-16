var companyProfile = angular.module('CompanyProfile',[]);

companyProfile.controller('MenuController',function($scope){
	
});

companyProfile.controller('AboutUsController',function($scope){
	$scope.informations = [
		{label:'description',value:"Not entered yet",type:"textarea",edit:false},
		{label:'Address:',value:'Not entered yet',type:'text',edit:false},
		
	];
});
