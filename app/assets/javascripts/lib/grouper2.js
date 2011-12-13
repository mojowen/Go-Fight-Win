function grouper (_rows) {
	var groups = currentView().groups();
	var flat_fields = fields().map( function(field) { return field.to_param});
	var flat_groups = groups.map( function(groups) { return groups.field()}).filter(function(elem) { return elem != undefined && elem != '' });

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
		for (var ii=0; ii < flat_groups.length; ii++) {
			var field = flat_groups[ii], value = typeof row[ field ] == 'function' ? row[ field ]() : row[ field ] ;
			if( value == '' || value == 'null' ) { value = '--'; }
			if( value.constructor.name == 'Date' ) { value = (value.getMonth()+1)+'/'+value.getDate()+'/'+value.getFullYear().toString().slice(-2); }
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
			if( ii == flat_groups.length ) {
				nested.rows.push(row);
			}
			nested = computer(nested, row);
		};
	
	};
	grouped._uniques = uniques || [];
	return grouped;
}