appDataModel.navigation = function() { 
	// Prevents unload if there's unsaved stuff
	window.onbeforeunload = function() { 
	  if ( dataModel.savingRows().length + dataModel.savingViews().length > 0 ) {
	    return "Woah woah woah woah, you have "+dataModel.savingState().prefix+" "+dataModel.savingState().text+'.';
	  }
	}

	$('.switch h2').live({
		click: function(e) {
			var $this = $(this),
				state = $this.text().toLowerCase().replace(/\+/,'').trim()
			e.preventDefault();
			dataModel.current.state(state);
			if( dataModel.current.view().id != 'new' ) {
				var new_url = state != 'analyze' ? '#'+state : '';
				try { window.history.pushState('', "Title", _url+'/'+dataModel.current.view().to_param()+new_url); } catch(e) { }
			}
			$(document).scrollTop(0);
		}
	});
	ko.bindingHandlers.betterChecked = {
	    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
	        // This will be called when the binding is first applied to an element
	        // Set up any initial state, event handlers, etc. here
	    },
	    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
	        // This will be called once when the binding is first applied to an element,
	        // and again whenever the associated observable changes value.
	        // Update the DOM element based on the supplied values here.
	    }
	};
}