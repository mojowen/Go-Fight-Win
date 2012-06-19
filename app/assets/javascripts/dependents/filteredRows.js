viewModel.filteredRows = ko.computed(
	{ read: function() {

		var _rows = rows(),
			quickSearch = dataModel.current.quickSearch(),
			returningRows = []

		if( typeof dataModel.current.view().filters == 'undefined' ) {
			returningRows = _rows // No filters means no filtering!
		} else {
			var filters = dataModel.current.view().filters();
			var flat_fields = fields().map( function(field) { return field.to_param});
			var flat_filters = filters.map( function(filters) { return filters.field});

			if(  flat_fields.filter( function(filter) { return flat_fields.indexOf(filter) > -1; } ).length > 0 && dataModel.current.filtered() ) {
				var filtered_rows = filterer(filters, _rows, flat_fields);
				returningRows = filtered_rows;
			} else {
				returningRows = _rows;
			}
			
		}


		if( quickSearch == '' || typeof quickSearch == 'undefined' ) return returningRows;
		else return returningRows.filter( function(el) { return el._flatten('json').slice(1,-1).replace(/\w+(?=":)(?!::)/g,'').replace(/"":/g,' ').replace(/",/g,'').toLowerCase().search(quickSearch.toLowerCase()) !== -1 })
	}, 
	deferEvaluation: true
},
viewModel);