appDataModel.analyze_template = function() {
	$('#analyze').on('click', '.add_filter', function(e) {
		dataModel.current.view().addFilter();
	});
}