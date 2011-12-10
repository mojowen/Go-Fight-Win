function filterer (filters, _rows, flat_fields) {
	var flat_fields = flat_fields || fields().map( function(field) { return field.to_param});
	return ko.utils.arrayFilter(_rows, function(row) {
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
						case 'contains' || 'has' || 'includes':
							passes = value.search(filter) !== -1 && passes;
							break;
						case 'does not contain' || 'does not include' || 'does not have':
							passes = value.search(filter) === -1 && passes;
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

}