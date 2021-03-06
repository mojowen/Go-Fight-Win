function rowModel(data) {
	data = typeof data == 'undefined' ? new Object : data;
	// Determining if vars are added in row object or directly
	if( data.Row || data.row ) { var row = data.row || data.Row; }
	else { var row = data; }

	// Setting up key properties
	if( typeof row.key == 'undefined' || typeof row.list == 'undefined' ) { throw new Error("mising some vital row data"); }
	this.key = ko.observable( row.key );
	this.list = row.list;
	this.created_at = row.created_at;
	this.updated_at = row.updated_at;
	var _fields = ko.toJS(fields);

	for( var i = 0; i < _fields.length; i++ ) {
		var field = _fields[i].to_param;
		this[field] = prepareValue(row[field], _fields[i].field_type);
		if( _fields[i].field_type == 'location' ) {
			var locationRow = this[field], address = locationRow().address(), latlng = locationRow().latlng()
			locationRow._initalAddress = address
			locationRow._googlePoint = ''
			locationRow._fail = ko.observable( latlng == 'error' )
			locationRow._located = ko.computed( function() {
				var address = this().address(), initialAddress = this._initalAddress, latlng = this().latlng()
				return address == initialAddress && latlng != '' && !this._fail()
			},locationRow)
			locationRow._locator = ko.computed( function() { 
				var address = this().address(), initialAddress = this._initalAddress, latlng = this().latlng(), located = this._located()
				if( !located && address != '' && latlng != 'error' ) {
					new gfMap()
					gfMap.map.geolocate( this )
				}
			},locationRow).extend( {throttle: 500 })
			locationRow._preview = ko.computed(function() {
				if( this._located() && !this._fail() ) {
					var latlng = this().latlng()
					return 'http://maps.googleapis.com/maps/api/staticmap?center='+latlng+'&zoom=12&size=190x100&maptype=roadmap&markers=color:blue%7C40.702147,-74.015794&markers=color:red%7C'+latlng+'&sensor=true'
				} else {
					return null
				}
			},locationRow)
		}
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

