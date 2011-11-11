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

function factoryList() {
	fields.removeAll();
	rows.removeAll();
	for (var i=0; i < 4; i++) {
		fields.push(factoryField());
	};
	for (var i=0; i < 10; i++) {
		rows.push(factoryRow());
	};
}