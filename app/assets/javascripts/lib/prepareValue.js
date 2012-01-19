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
			default:
				returning = value;
		}
	}
	
	if( !args['no_ko'] ) { return ko.observable(returning); }
	else { return returning; }
	
}