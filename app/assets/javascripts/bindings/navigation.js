appDataModel.navigation = function() { 
	// Prevents unload if there's unsaved stuff
	window.onbeforeunload = function() { 
	  if ( (dataModel.savingRows().length + dataModel.savingViews().length > 0) && typeof dev == 'undefined' ) {
	    return "Woah woah woah woah, you have "+dataModel.savingState().prefix+" "+dataModel.savingState().text+'.';
	  }
	}

	$('.switch h2').live({
		click: function(e) {
			var $this = $(this),
				state = $this.text().toLowerCase().replace(/\+/,'').trim()
			e.preventDefault();
			dataModel.current.state(state);
			dataModel.current.quickSearch('');
			if( dataModel.current.view().id != 'new' ) {
				var new_url = state != 'analyze' ? '#'+state : '';
				try { window.history.pushState('', "Title", _url+'/'+dataModel.current.view().to_param()+new_url); } catch(e) { document.location.hash = state }
			} else {
				var new_url = state != 'explore' ? '#'+state : '';
				try { window.history.pushState('', "Title", _url+new_url); } catch(e) { document.location.hash = state }
			}
			$(document).scrollTop(0);
		}
	});

}