function rowModel(data) {
	data = typeof data == 'undefined' ? new Object : data;
	// Determining if vars are added in row object or directly
	if( data.Row || data.row ) { var row = data.row || data.Row; }
	else { var row = data; }

	// Setting up key properties
	if( typeof row.key == 'undefined' || typeof row.list == 'undefined' ) { throw new Error("mising some vital row data"); }
	this.key = ko.observable( row.key );
	this.list = row.list;

	for( var i = 0; i < fields().length; i++ ) {
		var field = fields()[i].name;
		if( typeof row[field] != 'undefined' ) {
			switch( fields()[i].field_type){
				case 'number':
					if( !isNaN(parseInt(row[field])) ) { this[field] = ko.observable(parseInt(row[field]) ); }
					else { this[field] = ko.observable( row[field] ); }
					break;
				case 'date':
					var attempt = new Date(row[field]);
					if( attempt == 'Invalid Date' ) { this[field] = ko.observable( row[field] );  }
					else { this[field] = ko.observable( new Date(attempt) ); }
					break;
				default:
					this[field] = ko.observable( row[field] );
			}
		} else {
			this[field] = ko.observable('');
		}
	}

	this._flatten = function(return_type) {
		var return_as = return_type || '';
		var init = ko.toJS(this);
		var changed_fields = new Object;
		for (var i=0; i < fields().length; i++) {
			var field_name = fields()[i].name;
			changed_fields[ field_name ] = init[field_name];
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
			return this.key() == 'new' ? 'newRowMenu' : 'rowMenu';
		}, 
		deferEvaluation: true,
	},
	this);
	
	return this;
}

