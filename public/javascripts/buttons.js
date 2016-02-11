var clicked=false
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
		alert('Click');
		var parameters = {username:$('#username').attr('value'),task:$(this).attr('task')};
		console.log('Params',parameters);
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

	$('#searchBtn').on('click',searchnav);

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
		$('#nosearch').show();

		console.log(e.target.type);
		var parameters = {search:$('#search').val(),type:e.target.type};
		console.log('ME SEARCH')
		//*Ovo ide ovdje
		if(parameters.search == ''){
			$('.nosearch').show()

			$('.predict-items').empty()
			return;


		}
		else{
			console.log(parameters.search)
		$.post('/search',parameters,function(data){

				$('.nosearch').hide()
			
				console.log(data)
				var n=-1;
				$('.predict-items').empty()
				clicked=true;
				if(clicked){$('.predict-items').append('<svg width="100%" height="100%"><rect width="100%" height="100%" style="fill:rgb(200,200,200);stroke-width:0;stroke:rgb(0,0,0)" /></svg>')}
				for(var i = 0;i<data.length;i++){
					var item = data[i];
					n+=1;
					if(item.perc>49 && clicked && n<8){
						$('.predict-items').append('<p style="position:absolute; top:'+String(13*n+3+3)+'%; left:50%; font-size:15px">'+item.type+'</p><img  href="http://localhost:1337/'+ item.name +'" style="width:75px; height:75px; position:absolute; top:'+String(13*n+2)+'%; left:10%;" id="profilePic" src="images/noUser1.jpg" style=""><a href="http://localhost:1337/'+ item.name +'" style="position:absolute; top:'+String(13*n+3)+'%; left:50%; font-size:20px">'+item.name+'</a>');
					}
					else{
						if(n == 0){
							$('.nosearch').show()


						}
						break;

					}

				}
				
				
				
			

			if(parameters.type != "text"){
				window.location = "/a"
			}
		});
	}
		//*	
	}
	function searchnav(){
		clicked=false;
		if(clicked){
			$('.predict-items').empty()
			clicked=false
		}
		else{
			$('.predict-items').append('<svg width="100%" height="100%"><rect width="100%" height="100%" style="fill:rgb(200,200,200);stroke-width:3;stroke:rgb(200,200,200);animation-name:pop;animation-duation:2s;" /></svg>')
			clicked=true
			search()

		}
	}

});
