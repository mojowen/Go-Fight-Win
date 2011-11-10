viewModel.groupedRows = ko.dependentObservable(
	{ read: function() {
		var groups = currentView.groups();
		var flat_fields = fields().map( function(field) { return field.name});
		var flat_groups = groups.map( function(groups) { return groups.field()});
		var _rows = rows();
		if(  flat_groups.filter( function(group) { return flat_fields.indexOf(group) > -1; } ).length > 0 ) {

			var grouped = { rows: [] }, uniques = []; 

			function unique_find(unique, val) {
				var index = ko.utils.arrayMap(  unique, function(item) { return item.value } ).indexOf( val )
				if( index < 0 ) {
					return false;
				} else {
					return index;
				}
			}

			for( var i = 0 ; _rows.length > i; i++ ) { 
				var row = _rows[i];
				var positions = [];
				for (var ii=0; ii < flat_groups.length; ii++) {
					var field = flat_groups[ii], value = row[ field ]() ;

					// creating unique arrays
					if( typeof uniques[ii] == 'undefined' ) { uniques[ii] = [] }

					var pos = unique_find(uniques[ii],value);
					if( pos === false ) {
						new_unique = {value: value, display: value};
						pos = uniques[ii].push(new_unique)-1
					}

					// creating nested objects
					positions.push(pos);
					var depth = '['+positions.join('].rows[')+']';
					var nested = eval('grouped.rows'+depth);
					if( typeof nested == 'undefined' ) {
						eval('grouped.rows'+depth+'= {_value: value, rows: [] }');
						nested = eval('grouped.rows'+depth);
					} 

					if( ii == flat_groups.length -1 ) {
						nested.rows.push(row);
					}

					// // calculating this row's values for each field
					for( var iii = 0; iii < fields().length; iii++ ) { 
						k = fields()[iii].name;
					
						// Creating the grouped row objects to hold meta information
						if( typeof( nested[k] ) == 'undefined' ) { nested[k] = {}; }
					
						var v = typeof row[k] == 'function' ? row[k]() : row[k]; 

						// Counting the number of things 
						if( typeof(nested[k]['count']) == 'undefined' ) { nested[k]['count'] = 1; }
						else { nested[k]['count'] += 1 }
					
						if( typeof nested[k]['_uniques'] == 'undefined' ) { nested[k]['_uniques'] = []; }
						if( nested[k]['_uniques'].indexOf(v) == -1 ) { nested[k]['unique'] = nested[k]['_uniques'].push(v);  }

						v = parseInt(v);
						// Adding sum, min, max if the value is a number 
						if( !isNaN(v) ) {
							if( typeof(nested[k]['sum']) == 'undefined' ) { 
								nested[k]['sum'] = v;
								nested[k]['average'] = v;
								nested[k]['max'] = v;
								nested[k]['min'] = v;
							} else { 
								nested[k]['sum'] += v;
								nested[k]['average'] = nested[k]['sum'] /  nested[k]['count'];
								nested[k]['min'] = v < nested[k]['min']  ? v : nested[k]['min'];
								nested[k]['max'] = v > nested[k]['max']  ? v : nested[k]['max']  
							}
						} 
					};
				};
			};
			return { rows: grouped.rows, unique: uniques};
		} else {
			return _rows;
		}
	}, 
	deferEvaluation: true
},
viewModel);

/************

- should have some sort of 'available groups' dependent in the view model (cause built off of fields, right? but its dependent on the view models grouping)

***********/


// function grouper(rows, field_value, parent ) {
// 
// 	unique = ko.utils.arrayGetDistinctValues( ko.utils.arrayMap( rows, 
// 		function(item){ 
// 			if( item[ field_value ] != null && item[ field_value ] != undefined  ) return item[ field_value ];
// 			else if ( item[ field_value ] == null ) return '';
// 		})
// 	); 
// 	var grouped = ko.utils.arrayMap( unique, function(item) {
// 		var returnable = {};
// 		if( parent != null ) {
// 			returnable.parent = parent;
// 		}
// 		returnable.value = item;
// 		
// 		returnable.display = returnable.value instanceof Date ? returnable.value.toDateString() : returnable.value;
// 		returnable.display = returnable.value == '' ? '(blank)' : returnable.value;
// 
// 		returnable.rows = [];
// 		for( var i = 0; i < rows.length; i++ ) {
// 			if( rows[i][field_value] == undefined || rows[i][field_value] == null ) { rows[i][field_value] = ''; } 
// 			if( rows[i][field_value] == item ) {
// 				returnable.rows.push( rows[i] ); 




// 				
// 			}
// 		}
// 		// Computing the average and the unique counts
// 		for( var k in returnable ) {

// 		}
// 		return returnable;
// 	});
// 	return grouped;
// }
