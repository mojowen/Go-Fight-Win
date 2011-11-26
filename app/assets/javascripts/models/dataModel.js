function appDataModel() {
	rows = ko.observableArray([]),
	newRows = ko.observableArray([]),
	fields = ko.observableArray([]),
	views = ko.observableArray([]),
	currentView = ko.observable({});

	views.find = function(search) {var flat_views = views().map( function(elem) { return  ko.toJS(elem); }); var results = seek(search, flat_views, 'name'); return results === -1 ? false : views()[results]; }
	rows.find = function(search) { var results = seek(search, dataModel.flatRows(),'key'); return results === -1 ? false : rows()[results]; }
	rows.find_temp = function(search) { var results = seek(search, dataModel.flatRows(),'_tempkey'); return results === -1 ? false : rows()[results]; }



	load = function() {
		if( typeof _fields != 'undefined' ) { 
			for (var i=0; i < _fields.length; i++) {
				fields.push( new fieldModel(_fields[i]) ); 
			};
			_fields = null;
		} 
		if( typeof _rows != 'undefined' ) { 
			for (var i=0; i < _rows.length; i++) {
				rows.push( new rowModel(_rows[i]) ); 
			};
			_rows = null;
		}
		if( typeof _views != 'undefined' ) { 
			for (var i=0; i < _views.length; i++) {
				views.push( new viewModel(_views[i]) ); 
			};
			_views = null;
		}
		if( typeof _currentView == 'undefined' ) { 
			currentView = new viewModel(); 
		} else { 
			currentView = new viewModel(_currentView); 
			_currentView = null;
		}
	}
	setCurrentView = function(newView) {
		if( newView.constructor.name == 'viewModel' ) {
			currentView = newView;
			rows.valueHasMutated();
			currentView.sortRows();
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
			currentView.sortRows();
		}
	};
	seek = function(search, array, term) {
		var term = typeof term == 'undefined' ? 'key' : term;
		return array.map( function(elem) { return elem[term]; }).indexOf(search);
	}
	// Should write an updateRow method that'll update a row on key or _tempkey (whichever is present)
}
var dataModel = new appDataModel();