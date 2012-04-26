function appDataModel() {
	rows = ko.observableArray([]),
	newRows = ko.observableArray([]),
	defaultRow = ko.observableArray([]),
	fields = ko.observableArray([]),
	views = ko.observableArray([]),
	saving = ko.observable(true);
	fields.width = ko.computed( function() {
		computed = 100 + 63; // rownum + rowend
		for (var i=0; i < fields().length; i++) {
			switch(fields()[i].field_type) {
				case 'date':
					computed += 150;
					break;
				case 'select':
					computed += 102;
					break;
				case 'children':
					computed += 120;
					break;
				case 'number':
					computed += 88;
					break;
				default:
					computed += 122;
					break;
			}
			computed += 2; // for the borders
		};
		return computed;
	});
	this.loaded = false,
	this.current = {
		me: this,
		view: ko.observable({}),
		state: ko.observable('explore'),
		filtered: ko.observable(false),
		form: ko.observable(true),
		height: ko.observable(800),
		width: ko.observable(1040)
	};
	this.current.height.scroll = ko.computed( function() {
		return Math.round(this.height() / 33 ) - 1
	},this.current)
	
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
			if( document.location.href != _url ) { try{ window.history.pushState('', "Title", _url+document.location.hash); } catch(e) { document.location = _url+document.location.hash; } }
		} else { 
			setCurrentView( views()[_currentView] ); 
			_currentView = null;
			dataModel.current.state('analyze');
		}
		if( document.location.hash == '#explore' ) {
			dataModel.current.state('explore');
		} else if( document.location.hash == '#add' || document.location.hash == '#edit') {
			dataModel.current.state('add');
		}

		if( rows().length >= _size ) { loaded = true; }
		else { loadAll(); }
		// if( typeof _operators != 'undefined' ) {
		// 	this.operators = _operators;
		// 	// _operators = null;
		// }

		// Setting height and width
		current.height( $('#scrolling').height() )
		current.width( $('#scrolling').width() )
	}
	setCurrentView = function(newView) {
		if( newView.constructor.name == 'viewModel' ) {
			current.view(newView);
		}
		if( views.indexOf(newView) !== -1 ) {
			current.filtered(true);
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