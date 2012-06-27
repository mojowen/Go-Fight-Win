function appDataModel() {
	rows = ko.observableArray([]),
	newRows = ko.observableArray([]),
	defaultRow = ko.observableArray([]),
	fields = ko.observableArray([]),
	views = ko.observableArray([]),
	saving = ko.observable(true);
	fields.width = ko.computed( function() {
		computed = 100 + 63; // rownum + rowend
		theseFields = fields()
		for (var i=0; i < theseFields.length; i++) {
			computed += theseFields[i].width()
		};
		return computed;
	});

	fields.reports = ko.computed( function() {
		var _fields = fields();
		var options = [];
		for (var i=0; i < _fields.length; i++) {
			var _field = _fields[i];
			options = options.concat(_field.fieldReports())
		};
		return options;
	},this);
	fields.dates = ko.computed( function() {
		return fields().filter( function(el) { return el.field_type == 'date' }).concat( [{to_param:'created_at',name:'created at'},{to_param:'updated_at',name:'updated at'}])
	},this)

	this.loaded = false,
	this.current = {
		me: this,
		view: ko.observable({}),
		state: ko.observable('explore'),
		filtered: ko.observable(false),
		form: ko.observable(true),
		height: ko.observable(600),
		table: {},
		quickSearch: ko.observable('')
	};
	var current = this.current


	views.find = function(search) {
		var results = views().map( function(elem) { return  elem.name(); }).indexOf(search);
		return results === -1 ? false : views()[results]; 
	}
	rows.find = function(search) { var flat_rows = rows().map( function(elem) { return  ko.toJS(elem); }); var results = seek(search, flat_rows,'key'); return results === -1 ? false : rows()[results]; }
	rows.find_temp = function(search) { var flat_rows = rows().map( function(elem) { return  ko.toJS(elem); });  var results = seek(search, flat_rows,'_tempkey'); return results === -1 ? false : rows()[results]; }

	load = function() {
		current.height(document.documentElement.clientHeight - 260)
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
			temp_rows.sort(function(a,b) { return a.key() > b.key() ? -1 : 1 } )[0]
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
		} else if ( document.location.hash == '#analyze') {
			dataModel.current.state('analyze');
		}

		if( rows().length >= _size ) { loaded = true; }
		else { loadAll(); }
		if( _quicksearch != null ) {
			dataModel.current.quickSearch(_quicksearch)
			_quicksearch = null
		}
		// if( typeof _operators != 'undefined' ) {
		// 	this.operators = _operators;
		// 	// _operators = null;
		// }

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
			rows.unshift( rowData );
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