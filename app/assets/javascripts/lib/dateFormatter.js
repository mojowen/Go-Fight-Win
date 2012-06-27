function dateFormatter(option,date) {
	if( ! date instanceof Date ) {
		date = new Date(date)
		if( date == 'Invalid Date' ) return false
	}
	var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	switch( option ) {
		case 'day': 
			return date.toDateString();
			break;
		case 'week': 
			var d = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() );
			return 'Week of '+(d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear().toString().slice(-2);
			break;
		case 'month': 
			return shortMonths[date.getMonth()]+' '+date.getFullYear().toString();
			break;
		case 'year': 
			return date.getFullYear().toString();
			break;
	}
}