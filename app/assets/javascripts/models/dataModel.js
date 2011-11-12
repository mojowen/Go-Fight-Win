function appDataModel() {
	rows = ko.observableArray([]);
	fields = ko.observableArray([]);
	views = ko.observableArray([]);
	load = function() {
		if( typeof _fields != 'undefined' ) { 
			for (var i=0; i < fields.length; i++) {
				rows.push( new rowModel(_rows[i]) ); 
			};
			_fields = null;
		} 
		if( typeof _rows != 'undefined' ) { 
			for (var i=0; i < _rows.length; i++) {
				rows.push( new rowModel(_rows[i]) ); 
			};
			_rows = null;
		}
		if( typeof currentView == 'undefined' ) { currentView = new viewModel(); } 
	}
	setCurrentView = function(newView) {
		if( newView.constructor.name == 'viewModel' ) {
			currentView = newView;
		}
	}
}
var dataModel = new appDataModel();