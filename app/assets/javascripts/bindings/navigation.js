appDataModel.navigation = function() { 
	$('.switch').live({
		click: function(e) {
			var $this = $(this);
			e.preventDefault();
			dataModel.current.state($this.text().toLowerCase())
		}
	});
}