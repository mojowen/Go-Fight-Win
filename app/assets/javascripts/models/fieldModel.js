function fieldModel(data) {

	if( data.Field || data.field ) { var field = data.field || data.Field; }
	else { var field = data; }

	// Setting up key properties
	if( typeof field.id == 'undefined' ||typeof field.name == 'undefined' ) { throw new Error("mising some vital field data"); }
	this.list = field.list;
	this.name = field.name;
	this.id = field.id;

	this.field_type = field.field_type || 'text';
	this.field_options = field.field_options || '';

	this.report = 'count';
	return this;
}