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
			case 'multi-select':
				returning = value.toString().toLowerCase().split(',');
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