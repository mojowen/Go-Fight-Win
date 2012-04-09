appDataModel.analyze_template = function() {
	$(document).on('click', '.add_filter', function(e) {
		dataModel.current.view().addFilter();
	});
	$(document).on('click', '.add_grouping', function(e) {
		var filter = ko.dataFor(this);
		dataModel.current.view().addGrouping();
	});
	$(document).on('click', '.filter .remove', function(e) {
		var filter = ko.dataFor(this);
		dataModel.current.view().removeFilter( filter );
	});
}