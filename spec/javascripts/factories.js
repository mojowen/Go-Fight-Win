var factoryfields = [];
var factoryrows = [];

function factoryField(info) {

	var data = info || new Object, field = new Object;
	field.id = data.id || factoryfields.length+1;
	field.name = data.name == 'Object' || data.name == undefined  ? 'name_'+factoryfields.length+1 : data.name;
	field.list = data.list || 'Test';

	if( data.field_type !== undefined ) { field.field_type = data.field_type; }
	if( data.field_options !== undefined ) { field.field_options = data.field_options; }

	factoryfields.push(field);
	return new fieldModel(field);
}
function factoryRow(info) {
	var data = info || new Object, row = new Object;
	row.key = data.key || factoryrows.length+1;
	row.list = data.list || 'Test';

	for(var i in info ) {
		if( i != 'key' || i != 'list' ){
			row[i] = data[i];
		}
	}

	factoryrows.push(row);
	return new rowModel(row);
}

function factoryList(args) {
	_list = 'Test';
	fields.removeAll();
	rows.removeAll();
	args = typeof args == 'undefined' ? {} : args;
	args.rows = typeof args.rows == 'undefined' ? 10 : args.rows;
	args.fields = typeof args.fields == 'undefined' ? 4 : args.fields;
	var da_rows = [], da_fields = [], set_fields = args.fields.constructor.name == 'Array' ? args.fields : [];
	args.fields = args.fields.constructor.name == 'Array' ? args.fields.length : args.fields;

	for (var i=0; i < args.fields; i++) {
		var fill = typeof set_fields[i] != 'undefined' ? set_fields[i] : '';
		da_fields.push(factoryField(fill));
	};
	fields(da_fields);
	
	for (var i=0; i < args.rows; i++) {
		da_rows.push(factoryRow());
	};
	rows(da_rows);
}