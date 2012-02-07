function grouper (_rows) {
	var groups = ko.toJS(dataModel.current.view().groups());

	var grouped = { rows: [] }, uniques = [];


	function unique_find(unique, val) {
		var index = ko.utils.arrayMap(  unique, function(item) { return item.value } ).indexOf( val );
		if( index < 0 ) {
			return false;
		} else {
			return index;
		}
	}

	for( var i = 0 ; _rows.length > i; i++ ) {
		var row = _rows[i];
		grouped = computer(grouped, row);
		
		var positions = [];
		for (var ii=0; ii < groups.length; ii++) {
			var field = groups[ii]['field'], 
				value = typeof row[ field ] == 'function' ? row[ field ]() : row[ field ],
				options = groups[ii]['options'],
				option = dataModel.current.view().groups()[ii]['option'](),
				field_type = groups[ii]['field_type'];
			if( value == '' || value == 'null' ) { value = '--'; }
			if( value.constructor.name == 'Date' ) { value = (value.getMonth()+1)+'/'+value.getDate()+'/'+value.getFullYear().toString().slice(-2); }
			if( field_type == 'children' ) { value = value.map(function(elem){ return elem.name; }).join(', '); }
			if( field_type == 'date' ) {
				var the_date = new Date(value);
				if( the_date != 'Invalid Date' ) {
					switch( option ) {
						case 'day': 
							value = the_date.toDateString();
							break;
						case 'week': 
							var d = new Date(the_date.getFullYear(), the_date.getMonth(), the_date.getDate() - the_date.getDay() );
							value = 'Week of '+(d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear().toString().slice(-2);
							break;
						case 'month': 
							value = $.datepicker._defaults.monthNamesShort[the_date.getMonth()]+' '+the_date.getFullYear().toString();
							break;
						case 'year': 
							value = the_date.getFullYear().toString();
							break;
					}
				}
			}

			// creating unique arrays
			if( typeof uniques[ii] == 'undefined' ) { uniques[ii] = [] }
		
			var pos = unique_find(uniques[ii],value);
			if( pos === false ) {
				new_unique = {value: value, display: value};
				pos = uniques[ii].push(new_unique)-1
			}

			uniques[ii][pos] = computer(uniques[ii][pos], row);

			// creating nested objects
			positions.push(pos);
			var depth = '['+positions.join('].rows[')+']';
			var nested = eval('grouped.rows'+depth);
			if( typeof nested == 'undefined' ) {
				eval('grouped.rows'+depth+'= {_value: value, rows: [], _field: field}');
				nested = eval('grouped.rows'+depth);
			} 
			if( ii == groups.length ) {
				nested.rows.push(row);
			}
			nested = computer(nested, row);
		};
	
	};
	grouped._uniques = uniques || [];
	return grouped;
}