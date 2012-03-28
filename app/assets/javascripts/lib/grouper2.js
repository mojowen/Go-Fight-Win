function grouper (_rows, groups, grouping) {
	var groups = typeof groups == 'undefined' ? ko.toJS(dataModel.current.view().groups()) : groups;

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
				option = groups[ii]['option'],
				field_type = groups[ii]['field_type'];
			if( value == '' || value == 'null' || typeof value == 'undefined' || value == null) { value = '--'; }
			if( value.constructor.name == 'Date' ) { value = (value.getMonth()+1)+'/'+value.getDate()+'/'+value.getFullYear().toString().slice(-2); }
			if( field_type == 'children' ) { 
				value = value == '--' ? [{name:'--'}] : value;
				value = value.map(function(elem){ return elem.name; });
			} else if( field_type == 'date' ) {
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

			value = value.constructor.name != 'Array' ? [value] : value;
			positions[ii] = typeof positions[ii] == 'undefined' ? [] : positions[ii];


			for (var iii=0; iii < value.length; iii++) {

				// creating unique arrays
				if( typeof uniques[ii] == 'undefined' ) { uniques[ii] = [] }
		
				var pos = unique_find(uniques[ii],value[iii]);
				if( pos === false ) {
					new_unique = {value: value[iii], display: value[iii]};
					pos = uniques[ii].push(new_unique)-1;
				}

				uniques[ii][pos] = computer(uniques[ii][pos], row);

				// creating nested objects
				positions[ii][iii] = pos;
				if( ii > 0 ) {
					for (var iv=0; iv < ii; iv++) {
						for (var v=0; v < positions[iv].length; v++) {
							var deep = [positions[iv][v], positions[ii][iii]];
							var depth = '['+deep.join('].rows[')+']';
						try{ //Throwing errors during tests...
							var nested = eval('grouped.rows'+depth);
						} catch(e){}
							if( typeof nested == 'undefined' ) {
								eval('grouped.rows'+depth+'= {_value: value[iii], rows: [], _field: field}');
								nested = eval('grouped.rows'+depth);
							} 
							if( ii == groups.length ) {
								nested.rows.push(row);
							}
							nested = computer(nested, row);
							nested.$grouping = grouping;
						};
					};
					
				} else {
					var depth = '['+positions[ii][iii]+']';
					var nested = eval('grouped.rows'+depth);

					if( typeof nested == 'undefined' ) {
						eval('grouped.rows'+depth+'= {_value: value[iii], rows: [], _field: field}');
						nested = eval('grouped.rows'+depth);
					} 
					if( ii == groups.length ) {
						nested.rows.push(row);
					}
					nested = computer(nested, row);
					nested.$grouping = grouping;
				}


			};

		};
	
	};
	grouped._uniques = uniques || [];
	return grouped;
}