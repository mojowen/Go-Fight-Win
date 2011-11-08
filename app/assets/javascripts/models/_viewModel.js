function viewModel( data ) {
	data = typeof data == 'undefined' ? new Object : data;
	// Determining if vars are added in row object or directly
	if( data.View || data.view ) { var view = data.View || data.view; }
	else { var view = data }


	this.filters = ko.observableArray([]);
	if( typeof view.filters == 'object' ) {
		for (var i=0; i < view.filters.length; i++) {
			this.filters.push( new filterModel( view.filters[i] ) );
		};
	} else if ( typeof data.filters == 'string' ) {
		this.filters.push( new filterModel( view.filters ) );
	}
	this.addFilter = function(filter) {
		this.filters.push( new filterModel( filter ) );
	}

	if( typeof view.name == 'undefined' ) {
		this.name = 'unsaved view'
	} else {
		this.name = view.name
	}

	return this;
}