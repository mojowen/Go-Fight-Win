function appDataModel() {
	rows = ko.observableArray([]);
	fields = ko.observableArray([]);
	views = ko.observableArray([]);

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
		if( views().map(function(elem) {elem.name();}).indexOf( newView.name() ) === -1 ) {
			return false
		} else {
			views.push(newView);
		}
	}
}
var dataModel = new appDataModel();