appDataModel.navigation = function() { 
	$('.switch h2').live({
		click: function(e) {
			var $this = $(this);
			e.preventDefault();
			dataModel.current.state($this.text().toLowerCase());
			$(document).scrollTop(0);
		}
	});
}