viewModel.filteredRows = ko.dependentObservable(
	{ read: function() {
		var filters = currentView().filters();
		var flat_fields = fields().map( function(field) { return field.name});
		var flat_filters = filters.map( function(filters) { return filters.field});
		var _rows = rows();
		if(  flat_fields.filter( function(filter) { return flat_fields.indexOf(filter) > -1; } ).length > 0 ) {
			var filtered_rows = ko.utils.arrayFilter(_rows, function(row) {
				var passes = true;
				for( var i = 0; i < filters.length; i++ ) {
					var field = filters[i].field(), operator = filters[i].operator(), filter = filters[i].filter();
					if ( typeof field != 'undefined' && flat_fields.indexOf(field) > -1 ) {
						var value = row[ field ]();
						value = value == undefined ? '' : value;

						if( operator.trim() != 'is' ) {
							operator = operator.replace('is ','').trim();
						} else {
							operator = operator.trim();
						}
						if( filter != undefined ) {
							switch(operator) {
								case 'is' || 'equal' || 'equals' || '=' || '==':
									passes = value == filter  && passes;
									break;
								case 'not' || "isn't" || 'not equal' || '<>' || '!=':
									passes = value != filter  && passes;
									break;
								case 'greater than' || 'more than' || 'after' || 'bigger than' || '>':
									passes = value > filter && passes;
									break;
								case 'greater than or equal' || 'more than or equal' || 'at or after' || 'bigger than or equal' || '>=':
									passes = value >= filter && passes;
									break;
								case 'less than' || 'fewer than' || 'before or equal' || 'smaller than' || '<':
									passes = value < filter && passes;
									break;
								case 'less than or equal' || 'fewer than or equal' || 'at or before' || 'smaller than or equal' || '<=':
									passes = value <= filter && passes;
									break;
								case 'ends with':
									passes = value.slice(-[filter.length]) == filter && passes;
									break;
								case 'starts with' || 'begins with':
									passes = value.slice(0,[filter.length]) == filter && passes;
									break;
								default:
									passes = passes;
									break;
							}
						}
					}
					if( !passes ) { break; }	
				}
				return passes;
			});
			return filtered_rows;
		} else {
			return _rows;
		}
	}, 
	deferEvaluation: true
},
viewModel);