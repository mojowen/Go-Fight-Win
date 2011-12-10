function computer (nested, row) {
	
	// // calculating this row's values for each field
	for( var iii = 0; iii < fields().length; iii++ ) {
		k = fields()[iii].to_param;
	
		// Creating the grouped row objects to hold meta information
		if( typeof( nested[k] ) == 'undefined' ) { nested[k] = {}; }
		
		var v = typeof row[k] == 'function' ? row[k]() : row[k]; 
		if( typeof(nested[k]['count']) == 'undefined' ) { nested[k]['count'] = 0; }
		if( typeof(nested[k]['count_int']) == 'undefined' ) { nested[k]['count_int'] = 0; }
		if( typeof nested[k]['_uniques'] == 'undefined' ) { nested[k]['_uniques'] = []; nested[k]['unique'] = 0 }

		if ( v != '' ) { 

			// Counting the number of things 

			nested[k]['count'] += 1;
			if( nested[k]['_uniques'].indexOf(v) == -1 ) { nested[k]['unique'] = nested[k]['_uniques'].push(v);  }

			v = parseInt(v);
			// Adding sum, min, max if the value is a number 
			if( !isNaN(v) ) {
				nested[k]['count_int'] += 1;
				
				if( typeof(nested[k]['sum']) == 'undefined' ) { 
					nested[k]['sum'] = v;
					nested[k]['average'] = v;
					nested[k]['max'] = v;
					nested[k]['min'] = v;
				} else { 
					nested[k]['sum'] += v;
					nested[k]['average'] = nested[k]['sum'] /  nested[k]['count_int'];
					nested[k]['min'] = v < nested[k]['min']  ? v : nested[k]['min'];
					nested[k]['max'] = v > nested[k]['max']  ? v : nested[k]['max']  
					nested[k]['average'] = Math.round(nested[k]['average']*100)/100
				}
			} 
		}
	};
	return nested;
}