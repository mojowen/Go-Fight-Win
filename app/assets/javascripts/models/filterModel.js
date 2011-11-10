function filterModel(data) {
	var field, operator, filter;
	if( typeof data == 'string' ) {
		data = data.replace(' to','')
		if( data.search(/"/) !== -1 ) {
			data = data.split(/"/)[0];
			filter = data[1];
		}
		data = data.split(' ');
		field = data.shift();
		filter = filter || data.pop();
		operator = data.join(' ');
	} else {
		field = data.field || '';
		operator = data.operator || '';
		filter = data.filter || '';
	}
	
	this.field = ko.observable(field);
	this.operator = ko.observable(operator);
	this.filter = ko.observable(filter);
	
	return this;
}