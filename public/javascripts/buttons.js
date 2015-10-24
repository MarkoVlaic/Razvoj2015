$(function(){
	$('#follow').on('click',function(){
		//post the request
		var parameters = {username:$('.username').attr('value')};
		$.get('/follow',parameters, function(res) {
       		
     	});

		var val = $('#follow').attr('value');
		if(val == 'follow'){
			console.log('Follow');
			$('#follow').prop('value','unfollow');
		}else{
			console.log('UN');
			$('#follow').prop('value','follow');
		}
	});

	//task buttons
	$('.like').on('click',function(){
		parameters = {title:$(this).attr('task'),author:$('.username').attr('value')};
		$.get('/like',parameters,function(res){
			// alert(res);
			$(this).prop('value',res);
		});
	});

	$('.add').on('click',function(){
		// alert($(this).attr('task'));
		var parameters = {username:$('.username').attr('value'),task:$(this).attr('task')};
		$.post('/addTaskToSolve',parameters);
		console.log('tsnjias',$(this).attr('value'));
		if($(this).attr('value') == 'Add to list'){
			$(this).prop('value','Remove from list');
		}else{
			$(this).prop('value','Add to list');
		}
	});

	//search
	$('#search').keyup(search);	

	$('#searchBtn').on('click',search);

	$('.predict').hide();

	//file manipulation
	$('#fileToggle').on('click',function(){
		$('.fileWrapper').fadeToggle();
	});

	$('.fileWrapper').hide();

	$('.file').each(function(div){
		console.log();
		$(this).css("width",$(this).prop("id").split('-')[3].length * 13 + "px");
		$(this).css("padding","1px");
	});

	// $('.btn-preview').on('click',function(){
	// 	alert('I am clicked');
	// 	console.log($(this).prop('id'));
	// 	var parameters = {name:$(this).prop('id')};
	// 	$.get('/preview',parameters,function(data){
	// 		console.log('Data I get is',data);
	// 		console.log('div#preview'+parameters.name);
	// 		//TODO:Finish preview functionality
	// 		//$('div.preview').html('<p>' + data + '</p>');
	// 	});
	// });

	$('.btn-download').on('click',function(){
		console.log($(this).prop('id'));
		var parameters = {name:$(this).prop('id')};
		$.post('/download',parameters);
	});

	function search(e)
	{
		console.log(e.target.type);
		var parameters = {search:$('#search').val(),type:e.target.type};
		$.get('/search',parameters,function(data){
			// alert(data);
			console.log(parameters.search.length);
			if(data.length == 0 || parameters.search.length == 0){
				console.log("Hide");
				$('.predict').hide();
			}else{
				var items = $('predict-items').children();
				
				console.log("Items",items);
				data.forEach(function(item){
					$('.predict-items').append('<li>'+item.name+'</li>');
				});
				
				// $('.predict').show();
			}

			if(parameters.type != "text"){
				window.location = "/searchPage"
			}
		});	
	}

});
