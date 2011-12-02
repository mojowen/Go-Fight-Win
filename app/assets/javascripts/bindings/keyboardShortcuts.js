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
					$('.left').css('color','red');
				case 39: 
					$('.right').css('color','red');
					break;
			}
		}
	});

}