function prepareValue (value, field_type, args) {
	var returning = '';
	var args = args || new Object;
	if( value != undefined ) {
		value = typeof value == 'string' ? value.trim() : value;
		switch( field_type ){
			case 'number':
				if( !isNaN(parseInt(value)) ) { returning = parseInt(value); }
				else { returning = value; }
				break;
			case 'date':
				var attempt = new Date(value);
				if( attempt == 'Invalid Date' ) { returning = value;  }
				else { returning = attempt.toDateString() }
				break;
			case 'select':
				returning = typeof value.capitalize == 'function' ? value.capitalize() : value;
				break;
			//Attempt at doing multi-select. Styling challenges as well as translating the data
			case 'multiselect':
				var tmp = value.toString().split(/\n/);
				returning = [];
				for (var i=0; i < tmp.length; i++) {
					if( tmp[i] != '--- ' && tmp[i] != '--' && tmp[i] != '---' && tmp[i] != '- --' && tmp[i] != '' ) { 
						var clean = tmp[i].replace('- ','').replace(/\"/g,'').replace(/\\/g,'').trim();
						returning.push( clean.capitalize() ); 
					}
				}; 
				break;
			case 'location':
				
				if( typeof value  == 'string' ) {
					if( value.search('---') === -1 ) value = { address: value }
					else {
						var temp = value.replace(/\n\n/g,'&&').split(/\n/)
						value = {}
						for( var i=0;i < temp.length; i++ ) { 
							var decon = temp[i].split(':'); 
							if( decon.length > 1 ) value[decon[0].trim()] = decon[1].replace("! '","'").trim().replace(/'/g,'').replace(/&&/g,"\n").replace(/\n  /g,"\n");
						}
					}
				}
				var address = value.address || '', latlng = value.latlng || ''
				if( address == '' ) latlng = ''
				returning = {address: !args['no_ko'] ? ko.observable(address) : address, latlng: !args['no_ko'] ? ko.observable(latlng) : latlng }
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
			case 'location':
				returning = { address: !args['no_ko'] ? ko.observable('') : '', latlng: !args['no_ko'] ? ko.observable('') : '' }
				break;
		}
	}


	if( !args['no_ko'] ) { return ko.observable(returning); }
	else { return returning }
	
}