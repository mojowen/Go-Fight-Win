appDataModel.analyze_template = function() {
	$('.section').on('click', '.add_filter', function(e) {
		dataModel.current.view().addFilter();
		e.stopPropagation();
	});
	$(document).on('click', '.remove', function(e) {
		var filter = ko.dataFor(this);
		dataModel.current.view().removeFilter( filter );
	});
}