function prepareValue (value, field_type, args) {
	var returning = '';
	var args = args || new Object;
	if( value != undefined ) {
		switch( field_type ){
			case 'number':
				if( !isNaN(parseInt(value)) ) { returning = parseInt(value); }
				else { returning = value; }
				break;
			case 'date':
				var attempt = new Date(value);
				if( attempt == 'Invalid Date' ) { returning = value;  }
				else { returning = attempt }
				break;
			case 'select':
				returning = value.toLowerCase();
				break;
			//Attempt at doing multi-select. Styling challenges as well as translating the data
			case 'multiselect':
				var tmp = value.toString().toLowerCase().split(/\n/);
				returning = [];
				for (var i=0; i < tmp.length; i++) {
					if( tmp[i] != '--- ' && tmp[i] != '--' && tmp[i] != '---' && tmp[i] != '- --' && tmp[i] != '' ) { 
						var clean = tmp[i].replace('- ','').replace(/\"/g,'').replace(/\\/g,'').trim();
						returning.push( clean[0].toUpperCase() + clean.slice(1,clean.length) ); 
					}
				}; 
				break;
			default:
				returning = value;
				break;
		}
	} else {
		switch( field_type ){
			case 'children':
				returning = [];
				break;
		}
	}

	if( !args['no_ko'] ) { return ko.observable(returning); }
	else { return returning; }
	
}