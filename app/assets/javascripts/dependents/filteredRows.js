viewModel.filteredRows = ko.dependentObservable(
	{ read: function() {
// var t = new Date();
		var filters = currentView().filters();
		var flat_fields = fields().map( function(field) { return field.to_param});
		var flat_filters = filters.map( function(filters) { return filters.field});
		var _rows = rows();
		if(  flat_fields.filter( function(filter) { return flat_fields.indexOf(filter) > -1; } ).length > 0 ) {
			var filtered_rows = filterer(filters, _rows, flat_fields);
// var d = new Date();
// console.log('filtered: '+(d-t));
			return filtered_rows;
		} else {
// var d = new Date();
// console.log('filtered: '+(d-t));
			return _rows;
		}
		
	}, 
	deferEvaluation: true
},
viewModel);