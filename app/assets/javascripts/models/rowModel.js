function rowModel(data) {
	data = typeof data == 'undefined' ? new Object : data;
	// Determining if vars are added in row object or directly
	if( data.Row || data.row ) { var row = data.row || data.Row; }
	else { var row = data; }

	// Setting up key properties
	if( typeof row.key == 'undefined' || typeof row.list == 'undefined' ) { throw new Error("mising some vital row data"); }
	this.key = ko.observable( row.key );
	this.list = row.list;
	var _fields = ko.toJS(fields);

	for( var i = 0; i < _fields.length; i++ ) {
		var field = _fields[i].to_param;
		this[field] = prepareValue(row[field], _fields[i].field_type);
	}

	this._flatten = function(return_type) {
		var return_as = return_type || '';
		var init = ko.toJS(this);
		var changed_fields = new Object;
		for (var i=0; i < fields().length; i++) {
			var field_name = fields()[i].to_param;
			if( init[field_name] == 'Invalid Date' ) { init[field_name] = "null"; }
			if( init[field_name] == '--' ) { init[field_name] = ""; }
			changed_fields[ field_name ] = prepareValue(init[field_name], fields()[i].field_type);
		};
		if( typeof this._destroy != 'undefined' ) { changed_fields._destroy = true; }
		if( return_as.toLowerCase() == 'json' ) {changed_fields = ko.toJSON(changed_fields);}
		return changed_fields;
	}

// number assign  if( this.field_type == 'number' ) { self[field_name] = ko.observable( parseInt( row[field_name] ) ); } 
// date assign    else if( this.field_type == 'date' ) { self[field_name] = row[field_name].length != 0 ? ko.observable( new Date(row[field_name]) ) : ko.obervable(''); } 
	var initDirty = this.key() == 'new'
	this.dirtyFlag = new ko.dirtyFlag(this, initDirty);
	if( initDirty ) {
		this._tempkey = rows().filter( function(el) { return typeof el._tempkey != 'undefined' }).length + newRows().length;
	}

	this._menu = ko.dependentObservable(
		{ read: function() {
			var val = this.key() == 'new' ? 'newRowMenu' : 'rowMenu';
			if( val == 'newRowMenu' ) {
				val = newRows.indexOf(this) === -1 ? 'unsavedRowMenu' : val;
			} 
			return val
		}, 
		deferEvaluation: true,
	},
	this);
	
	return this;
}

