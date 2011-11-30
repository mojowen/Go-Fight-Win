function keyboardShortcuts (argument) {

	$(document).keydown(function(e){
		if( $('input, textarea, select').is(":focus") ) {
			// When editing something
		} else {
			switch(e.keyCode){
				case 37:
					currentView().move('left');
					break;
				case 39: 
					currentView().move('right');
					break;
			}
		}
	});

}