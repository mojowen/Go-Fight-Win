function viewModel( data ) {
	data = typeof data == 'undefined' ? new Object : data;
	// Determining if vars are added in row object or directly
	if( data.View || data.view ) { var view = data.View || data.view; }
	else { var view = data }


	this.filters = ko.observableArray([]);
	this.addFilter = function(filter) {
		filter = typeof filter == 'undefined' ? {filter: '', field: '', operator: 'is'} : filter;
		this.filters.push( new filterModel( filter ) );
	}
	if( typeof view.filters != 'undefined' ) {
		if( typeof view.filters == 'object' ) {
			for (var i=0; i < view.filters.length; i++) {
				this.filters.push( new filterModel( view.filters[i] ) );
			};
		} else if ( typeof data.filters == 'string' ) {
			this.filters.push( new filterModel( view.filters ) );
		}
	} else {
		this.addFilter();
	}

	this.groups = ko.observableArray([]);
	this.addGroup = function(group) {
		group = typeof group == 'undefined' ? '' : group
		this.groups.push( new groupModel( group ) );
	}
	if( typeof view.groups != 'undefined' ) {
		if( typeof view.groups == 'object' ) {
			for (var i=0; i < view.groups.length; i++) {
				this.groups.push( new groupModel( view.groups[i] ) );
			};
		} else if ( typeof view.groups == 'string' ) {
			this.groups.push( new groupModel( view.groups ) );
		}
	} else {
		this.addGroup();
	}

	if( typeof view.name == 'undefined' ) {
		this.name = 'unsaved view'
	} else {
		this.name = view.name
	}

	return this;
}