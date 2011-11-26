function views_template() {
	$('.views').live('click', function(e) {
		var $this = $(this), view = ko.dataFor(this);
		setCurrentView(view);
		console.log(view);
		e.preventDefault();
	});
}