$(function(){
	$('#addTask').hide();
	$('#uploadWrapper').hide();

	$('#create').on('click',function(){
		$('#addTask').fadeToggle();
		if($('#create').val() === 'Create task'){
			$('#create').prop('value','Hide');
		}else{
			$('#create').prop('value','Create task');
		}
	});

	$('#upload').on('click',function(){
		$('#uploadWrapper').fadeToggle();
		if($('#upload').val() === 'Upload task'){
			$('#upload').prop('value','Hide');
		}else{
			$('#upload').prop('value','Upload task');
		}
	});

});