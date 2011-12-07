function keyboardShortcuts (argument) {
	$(document).keyup(function(e){
		if( $('input, textarea, select').is(":focus") ) {
			// When editing something
		} else {
			switch(e.keyCode){
				case 37:
					currentView().move('left');
					$('.left').css('color','black');
					break;
				case 39: 
					currentView().move('right');
					$('.right').css('color','black');
					break;
			}
		}
	});
	$(document).keydown(function(e){
		if( $('input, textarea, select').is(":focus") ) {
			// When editing something
		} else {
			switch(e.keyCode){
				case 37:
					$('.left').css('color','#747474');
				case 39: 
					$('.right').css('color','#747474');
					break;
			}
		}
	});

	$('#switch').live('click',function() {
		notify('Loading...');
		currentView().groups.on( currentView().groups.on() ? false : true );
		clear();
	});
	$('.goal_open').live('click',function(){
		$(this).addClass('is_goal');
		$('#goal_box').show();
	});
	$('.goal_clear').live('click',function(){
		$('#goal_box').hide();
		currentView().goal().value(undefined);
		currentView().goal().field(undefined);
		$('.goal_open').removeClass('is_goal');
	});
	
	
}