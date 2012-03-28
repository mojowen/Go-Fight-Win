appDataModel.navigation = function() { 
	$('.switch h2').live({
		click: function(e) {
			var $this = $(this);
			e.preventDefault();
			dataModel.current.state($this.text().toLowerCase());
			if( dataModel.current.view().id != 'new' ) {
				var new_url = $this.text().toLowerCase() == 'explore' ? '#explore' : '';
				try { window.history.pushState('', "Title", _url+'/'+dataModel.current.view().to_param()+new_url); } catch(e) { }
			}
			$(document).scrollTop(0);
		}
	});
}