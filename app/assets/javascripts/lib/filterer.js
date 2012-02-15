function filterer (filters, _rows, flat_fields) {
	var flat_fields = flat_fields || fields().map( function(field) { return field.to_param});
	return ko.utils.arrayFilter(_rows, function(row) {
		var passes = true;
		for( var i = 0; i < filters.length; i++ ) {
			var field = filters[i].field(), operator = filters[i].operator(), filter = filters[i].filter();
			if ( typeof field != 'undefined' && filters[i].obj() != undefined ) {
				var value = row[ field ]();
				value = value == undefined ? '' : value;
				filter = prepareValue(filter, filters[i].obj().field_type, {no_ko: true});
				if( operator.trim() != 'is' ) {
					operator = operator.replace('is ','').trim();
				} else {
					operator = operator.trim();
				}
				if( filter != undefined ) {
					switch(true) {
						case (operator == 'is' || operator == 'equal' || operator == 'equals' || operator == '=' || operator == '=='):
							passes = value == filter  && passes;
							break;
						case (operator == 'not' || operator ==  'not equal' || operator ==  '<>' || operator ==  '!='):
							passes = value != filter  && passes;
							break;
						case (operator == 'greater than' || operator ==  'more than' || operator ==  'bigger than' || operator ==  '>'):
							passes = value > filter && passes;
							break;
						case (operator == 'greater than or equal' || operator ==  'more than or equal' || operator ==  'after' || operator ==  'bigger than or equal' || operator ==  '>='):
							passes = value >= filter && passes;
							break;
						case (operator == 'less than' || operator ==  'fewer than' || operator ==  'smaller than' || operator ==  '<'):
							passes = value < filter && passes;
							break;
						case (operator == 'less than or equal' || operator ==  'fewer than or equal' || operator ==  'before' || operator ==  'smaller than or equal' || operator ==  '<='):
							passes = value <= filter && passes;
							break;
						case (operator == 'ends with'):
							passes = value.slice(-[filter.length]) == filter && passes;
							break;
						case (operator == 'starts with' || operator ==  'begins with'):
							passes = value.slice(0,[filter.length]) == filter && passes;
							break;
						case (operator == 'contains' || operator ==  'has' || operator ==  'includes'):
							passes = value.toString().search(filter) !== -1 && passes;
							break;
						case (operator == 'does not contain' || operator ==  'does not include' || operator ==  'does not have'):
							passes = value.toString().search(filter) === -1 && passes;
							break;
						case (operator == 'empty' || operator ==  'blank' ):
							passes = (value == '' || value == '--') && passes;
							break;
						case (operator == 'not empty' || operator ==  'not blank'):
							passes = (value != '' && value != '--') && passes;
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