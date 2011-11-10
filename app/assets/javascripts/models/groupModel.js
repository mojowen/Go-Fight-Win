function groupModel(data) {
	var field, options;
	
	if( typeof data == 'string' ) {
		field = data;
		options = '';
	} else {
		field = data.field || '';
		options = data.options || '';
	}

	this.field = ko.observable(field);
	this.options = ko.observable(options);

	return this;

}