viewModel.filteredRows = ko.computed(
	{ read: function() {

		var _rows = rows()
		if( typeof dataModel.current.view().filters == 'undefined' ) return _rows // No filters means no filtering!

		var filters = dataModel.current.view().filters();
		var flat_fields = fields().map( function(field) { return field.to_param});
		var flat_filters = filters.map( function(filters) { return filters.field});

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