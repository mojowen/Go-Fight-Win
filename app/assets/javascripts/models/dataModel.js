function appDataModel() {
	rows = ko.observableArray([]),
	newRows = ko.observableArray([]),
	defaultRow = ko.observableArray([]),
	fields = ko.observableArray([]),
	views = ko.observableArray([]),
	saving = ko.observable(true);
	
	this.loaded = false,
	this.current = {
		me: this,
		view: ko.observable({}),
		state: ko.observable('explore')
	};
	var current = this.current,
		loaded = this.loaded;


	views.find = function(search) { var flat_views = views().map( function(elem) { return  ko.toJS(elem); }); var results = seek(search, flat_views, 'name'); return results === -1 ? false : views()[results]; }
	rows.find = function(search) { var flat_rows = rows().map( function(elem) { return  ko.toJS(elem); }); var results = seek(search, flat_rows,'key'); return results === -1 ? false : rows()[results]; }
	rows.find_temp = function(search) { var flat_rows = rows().map( function(elem) { return  ko.toJS(elem); });  var results = seek(search, flat_rows,'_tempkey'); return results === -1 ? false : rows()[results]; }

	load = function() {
		if( typeof _fields != 'undefined' ) { 
			for (var i=0; i < _fields.length; i++) {
				fields.push( new fieldModel(_fields[i]) ); 
			};
			_fields = null;
		} 
		if( typeof _rows != 'undefined' ) { 
			var temp_rows = [];
			for (var i=0; i < _rows.length; i++) {
				temp_rows.push( new rowModel(_rows[i]) ); 
			};
			rows(temp_rows);
			_rows = null;
			temp_rows = null;
		}
		if( typeof _views != 'undefined' ) { 
			for (var i=0; i < _views.length; i++) {
				views.push( new viewModel(_views[i]) ); 
			};
			_views = null;
		}
		if( typeof _currentView == 'undefined' ) { 
			setCurrentView( new viewModel() );
			if( document.location.href != _url ) { try{ window.history.pushState('', "Title", _url+'#'+document.location.hash); } catch(e) { document.location = _url; } }
		} else { 
			setCurrentView( views()[_currentView] ); 
			_currentView = null;
			if( document.location.hash == 'data' ) {
				dataModel.current.state('explore');
			} else {
				dataModel.current.state('analyze');
			}
		}
		if( rows().length >= _size ) { loaded = true; }
		else { loadAll(); }
		// if( typeof _operators != 'undefined' ) {
		// 	this.operators = _operators;
		// 	// _operators = null;
		// }
	}
	setCurrentView = function(newView) {
		if( newView.constructor.name == 'viewModel' ) {
			current.view(newView);
			// rows.valueHasMutated();
			// current.view().sortRows();
		}
	}
	addView = function(newView) {
		if( views().map( function(elem) { return elem.name(); }).indexOf( newView.name() ) === -1 ) {
			views.push(newView);
		} else {
			return false;
		}
	}
	addRow = function(rowData) {
		if( rowData.constructor.name == 'rowModel' ) {
			rows.push( rowData );
			// This is where deduplicating methods, etc, could fit
			current.view().sortRows();
		}
	};
	seek = function(search, array, term) {
		var term = typeof term == 'undefined' ? 'key' : term;
		return array.map( function(elem) { return elem[term]; }).indexOf(search);
	}

	return this;
}
var dataModel = new appDataModel();