function groupModel(data) {
	var field, option, options = [];
	
	if( typeof data == 'string' ) {
		field = data;
		options = '';
	} else {
		field = data.field || '';
		option = data.option || '';
	}
	var pos = fields().map( function(el) { return el.to_param }).indexOf(field),
		_field = pos !== -1 ? fields()[pos] : '';
	
	if( _field.field_type == 'date' ) {
		options = ['day','week','month','year'];
	}



	this.field = ko.observable(field);
	this.name = _field.name;
	this.field_type = _field.field_type;

	if( data.field == 'created_at' ||  data.field == 'updated_at' ) {
		this.field_type = 'date'
		options = ['day','week','month','year'];
	} 

	if( options.length > 0 ) {
		var pos = options.indexOf(option);
		option = pos !== -1 ? options[pos] : options[options.length-1];
	}
	this.option = ko.observable(option || data.option);
	this.options = options;

	return this;

}