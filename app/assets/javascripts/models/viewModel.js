function viewModel( data ) {
	data = typeof data == 'undefined' ? new Object : data;
	// Determining if vars are added in row object or directly
	if( data.View || data.view ) { var view = data.View || data.view; }
	else { var view = data }

//  For the pivot talbe and groups
	this.reportOn = ko.observable();
	this.goal = ko.observable({field: ko.observable(''), value: ko.observable('')});

	this.goal.label = ko.dependentObservable({ 
		read: function() {
			if( currentView().goal().field() == undefined || currentView().goal().value() == '' || currentView().goal().value() <= 0 || isNaN(parseInt(currentView().goal().value())) ) {
				return false;
			} else {
				return currentView().goal().field().label+' '+currentView().goal().value()
			}
		},
		deferEvaluation: true 
	}, 
	this);
	this.goal.field = ko.dependentObservable({ 
		read: function() {
			if( currentView().goal().field() == undefined ) {
				return '';
			} else {
				return currentView().goal().field().name;
			}
		},
	deferEvaluation: true 
	}, 
	this);
	this.pivotValues = ko.dependentObservable({ 
		read: function() {
			if( currentView().goal.label() ) { 
				var select = ko.toJS(currentView().goal().field);
				select.label = 'goal'
				select.long_label = select.label+': '+select.name
				return [ select ].concat(viewModel.pivotedRows());
			} else { 
				return viewModel.pivotedRows()
			} 
		},
	deferEvaluation: true 
	}, 
	this);
	
	

// Paging and Visible
	var visible = parseInt(data.visible) || 30, paged = parseInt(data.paged) || 0;
	if( isNaN(paged) ) { paged = 0; }
	if( isNaN(visible) || visible > 200 ) { visible = 30; }
	this.paged = ko.observable(0);
	this.visible = ko.observable(visible);

	this.page = function(loc) {
		var loc = parseInt(loc);
		if( isNaN(loc) ) { this.paged(0); return false; }		
		if( loc < 0 ) { 
			this.paged(0);
			return false;
		} else if ( loc > dataModel.rowSize() ) {
			this.paged( dataModel.rowSize() - this.visible() );
			return false;
		} else {
			this.paged( loc );
			return true
		}
	}

	this.move = function(dir) {
		switch(dir) {
			case 'left' || 'down' :
				this.page( this.paged() - this.visible() );
				break;
			case 'right' || 'up' :
				this.page( this.paged() + this.visible() );
				break;
			case 'start' || 'far left' || 'beginning':
				this.page(-1);
				break;
			case 'end' || 'far right' || 'finish':
				this.page( rows().length + 1);
				break;
		}
	}
	
	this.page(paged);


// Filtering
	this.filters = ko.observableArray([]);
	this.addFilter = function(filter) {
		filter = typeof filter == 'undefined' ? {filter: '', field: '', operator: 'is'} : filter;
		this.filters.push( new filterModel( filter ) );
	}
	if( typeof view.filters != 'undefined' && view.filters != null ) {
		if( typeof view.filters == 'object' ) {
			for (var i=0; i < view.filters.length; i++) {
				this.filters.push( new filterModel( view.filters[i] ) );
			};
		} else if ( typeof data.filters == 'string' ) {
			this.filters.push( new filterModel( view.filters ) );
		}
	} else {
		// this.addFilter();
	}

// Grouping
	this.groups = ko.observableArray([]);
	this.addGroup = function(group) {
		group = typeof group == 'undefined' ? '' : group
		this.groups.push( new groupModel( group ) );
	}
	if( typeof view.groups != 'undefined' && view.groups != null ) {
		if( typeof view.groups == 'object' && view.groups.length > 0) {
			var t_groups = [];
			for (var i=0; i < view.groups.length; i++) {
				t_groups.push( new groupModel( view.groups[i] ) );
			};
			this.groups(t_groups);
		} else if ( typeof view.groups == 'string' ) {
			this.groups.push( new groupModel( view.groups ) );
		}
	} 
	this.availableGroupsRender = function(field) {
		var returnme = [];
		
		if( field() == undefined || field() == '' ) {
			returnme = viewModel.availableGroups();
		} else {
			returnme = [field].concat(viewModel.availableGroups());
		}
		return returnme.sort();
	}


// Sorting
	this.sorts = ko.observableArray([]);
	this.sortRows = function(temp_field) {
		var t = new Date();
		var _sorts = ko.toJS( this.sorts() );
		if( typeof temp_field != 'undefined' ) { 
			_sorts.push( { field: temp_field, direction: 'ASC' } ); 
		}
		var flat_fields = fields().map(function(elem) { return elem.name;} );
		var sort_match = _sorts.filter( function(elem) { return flat_fields.indexOf( elem.field ) > -1; });
		if( sort_match.length > 0 ) {
			rows().sort(
				function(a,b) {
					for( var i = 0; i < sort_match.length; i++ ) {
						var sort_field = sort_match[i]['field'], sort_direction = sort_match[i]['direction'];
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
			var d = new Date();
			console.log('sorting: '+(d-t))
		}
	}
	this.addSort = function(sort) {
		sort = typeof sort == 'string' ? {field: ko.observable(sort), direction: ko.observable('ASC') } : {field: ko.observable(sort.field), direction: ko.observable(sort.direction) };
		this.sorts.push(sort);
	}
	if( typeof view.sorts != 'undefined' && view.sorts != null ) {
		if( typeof view.sorts == 'string' ) {
			this.addSort(view.sorts)
		} else {
			for (var i=0; i < view.sorts.length; i++) {
				this.addSort( view.sorts[i] );
			};
		}
	} else {
		// this.addSort('');
	}

// Naming
	if( typeof view.name == 'undefined' && view.name == null ) {
		this.name = ko.observable('unsaved view');
		this.id = 'new'
	} else {
		this.name = ko.observable(view.name)
		this.id = view.id
	}
	this.to_param = function () {
		if( this.id != 'new' ) {
			return view.name.replace(/ /g,'_').toLowerCase();
		} else {
			return ''
		}
	}
	this.slug = view.slug


// Flatten and Dirty Flag
	this._flatten = function(return_type) {
		var returnable = new Object;
		returnable.name = this.name;
		returnable.id = this.id;
		returnable.visible = this.visible;
		returnable.paged = this.paged;
		returnable.goal = this.goal;
		returnable.reportOn = this.reportOn;
		
		if( typeof this._destroy != 'undefined' ) { returnable._destroy = true; }

		if( typeof this.groups == 'function' ) { returnable.groups = this.groups().filter(function(elem){ return elem.field() != '' && elem.field() != undefined }); } else { returnable.groups = this.groups.filter(function(elem){ return elem.field != '' }); }
		if( typeof this.sorts == 'function' ) { returnable.sorts = this.sorts().filter(function(elem){ return elem.field() != '' && elem.field() != undefined }); } else { returnable.sorts = this.sorts.filter(function(elem){ return elem.field != '' }); }
		if( typeof this.filters == 'function' ){returnable.filters = this.filters().filter(function(elem){ return elem.field() != '' && elem.field() != undefined });} else { returnable.filters = this.filters.filter(function(elem){ return elem.field != '' }); }
		if( return_type == 'json' ) {return ko.toJSON( returnable );}
		else { return ko.toJS( returnable ); }
	}
	var initDirty = this.id == 'new'
	this.dirtyFlag = new ko.dirtyFlag(this, initDirty);

	return this;
}