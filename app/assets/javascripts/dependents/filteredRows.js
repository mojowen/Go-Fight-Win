viewModel.filteredRows = ko.dependentObservable(
	{ read: function() {
// var t = new Date();
		var filters = dataModel.current.view().filters();
		var flat_fields = fields().map( function(field) { return field.to_param});
		var flat_filters = filters.map( function(filters) { return filters.field});
		var _rows = rows();
		if(  flat_fields.filter( function(filter) { return flat_fields.indexOf(filter) > -1; } ).length > 0 && dataModel.current.filtered() ) {
			var filtered_rows = filterer(filters, _rows, flat_fields);
			return filtered_rows;
		} else {
			return _rows;
		}
		
	}, 
	deferEvaluation: true
},
viewModel);