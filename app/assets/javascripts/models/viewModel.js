function viewModel( data ) {
	data = typeof data == 'undefined' ? new Object : data;
	// Determining if vars are added in row object or directly
	if( data.View || data.view ) { var view = data.View || data.view; }
	else { var view = data }

	var visible = parseInt(data.visible) || 50, paged = parseInt(data.paged) || 0;
	if( isNaN(paged) ) { paged = 0; }
	if( isNaN(visible) || visible > 200 ) { visible = 50; }
	this.paged = ko.observable(paged);
	this.visible = ko.observable(visible);

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
	this.sorts = ko.observableArray([]);
	this.sortRows = function() {
		var sorts = this.sorts();
		var flat_fields = fields().map(function(elem) { return elem.name;} );
		var sort_match = sorts.filter( function(elem) { return flat_fields.indexOf( elem.field() ) > -1; });
		if( sort_match.length > 0 ) {
			rows().sort(
				function(a,b) {
					for( var i = 0; i < sorts.length; i++ ) {
						var sort_field = sorts[i]['field'](), sort_direction = sorts[i]['direction']();
						// Something to look up and reference when the field type is something weird would be helpful
						a_val = a[ sort_field ]() == undefined ? '' : a[ sort_field ]();
						b_val = b[ sort_field ]() == undefined ? '' : b[ sort_field ]();
						a_val = typeof a_val == 'string' ? a_val.toLowerCase() : a_val;
						b_val = typeof b_val == 'string' ? b_val.toLowerCase() : b_val;
			
						if( sort_field == 'key' ){
							if( a_val == 'new' && b['key']() == 'new' ) { 
								a_val = a['_tempkey'], b_val = b['_tempkey']; 
							} else {
								if( a_val == 'new' ) { return 1; }
								if( b_val == 'new' ) { return -1; }
							}
						}
						if( a_val != b_val ) {
							if( sort_direction == 'DESC' ) { 
								return a_val > b_val ? -1 : 1; 
							} else { 
								return a_val < b_val ? -1 : 1; 
							} 
						}
					}
				}
			);
			rows.valueHasMutated();
		}
	}
	this.addSort = function(sort) {
		sort = typeof sort == 'string' ? {field: ko.observable(sort), direction: ko.observable('ASC') } : {field: ko.observable(sort.field), direction: ko.observable(sort.direction) };
		this.sorts.push(sort);
	}
	if( typeof view.sorts != 'undefined' ) {
		if( typeof view.sorts == 'string' ) {
			this.addSort(view.sorts)
		} else {
			for (var i=0; i < view.sorts.length; i++) {
				this.addSort( view.sorts[i] );
			};
		}
	} else {
		this.addSort('');
	}

	if( typeof view.name == 'undefined' ) {
		this.name = ko.observable('unsaved view');
		this.id = 'new'
	} else {
		this.name = ko.observable(view.name)
		this.id = view.id
	}
	
	this._flatten = function(return_type) {
		var returnable = new Object;
		returnable.name = this.name;
		returnable.id = this.id;
		returnable.visible = this.visible;
		returnable.paged = this.paged;

		returnable.groups = this.groups;
		returnable.sorts = this.sorts;
		returnable.filters = this.filters;
		return ko.toJSON( returnable );
	}

	var initDirty = this.id == 'new'
	this.dirtyFlag = new ko.dirtyFlag(this, initDirty);

	return this;
}