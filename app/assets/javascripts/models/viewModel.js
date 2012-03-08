function viewModel( data ) {
	data = typeof data == 'undefined' ? new Object : data;
	// Determining if vars are added in row object or directly
	if( data.View || data.view ) { var view = data.View || data.view; }
	else { var view = data }

	this.now = ko.observable(0);
	this.end = ko.observable(30);
	this.start =  ko.observable(0);
	
	this.jump = function(row,args) {
		var view = ko.toJS(dataModel.current.view),
			length = viewModel.filteredRows().length,
			new_top = view.start,
			args  = args || {};

		row = row == 'bottom' ?  length : row;
		row = row == 'top' ? 0 : row;
		
		// Setting the top bound, don't mess with it if you've already rendered that row
		if( row > view.end || row < view.start ) { new_top = row - 30; }
		// Don't let the top bound be less than 0
		if( new_top < 0 ) { new_top = 0; }

		// Setting the bottom bound to not exceed the row length
		var bottom = row+17 > length ? length : row+60;
		// The order here matters. Updating one of these triggers the dependent variable
		// and is evaluated using slice( top, bottom)

		// Should update into a zero array (e.g. .slice(100,0) )
		// not a huge array (e.g. .slice(0,130) )
		if( new_top > bottom ) {
			dataModel.current.view().start( new_top);
			dataModel.current.view().end(bottom);
		} else {
			dataModel.current.view().end(bottom);
			dataModel.current.view().start( new_top);
		}

		$('#scrolling').scrollTop(row*26);


		if( typeof args.callback != 'undefined' ) {
			args.callback();
		}
	}

	this.reset = function() { 
			this.jump('top');
		}

// Filtering
	this.filters = ko.observableArray([]);
	this.addFilter = function(filter) {
		filter = typeof filter == 'undefined' ? {filter: '', field: '', operator: 'contains'} : filter;
		this.filters.push( new filterModel( filter ) );
		dataModel.current.filtered(true);
	}
	this.removeFilter = function(filter) {
		this.filters.remove( filter );
		if( this.filters().length == 0 ) { dataModel.current.filtered(false); }
	}
	if( typeof view.filters != 'undefined' && view.filters != null ) {
		if( typeof view.filters == 'object' ) {
			for (var i in view.filters) {
				this.filters.push( new filterModel( view.filters[i] ) );
			};
		} else if ( typeof data.filters == 'string' ) {
			this.filters.push( new filterModel( view.filters ) );
		}
	} 


// Grouping
	this.groups = ko.observableArray([]);
	this.groupings = ko.observableArray([]);

	this.addGrouping = function() {
		this.groupings.push( new groupingModel() )
	}
	if( typeof view.groups != 'undefined' && view.groups != null ) {
		var t_groups = [];
		for (var i in view.groups) {
			t_groups.push( new groupingModel( view.groups[i] ) );
		};
		this.groupings(t_groups);
	} 


	var pivot = typeof view.pivot == 'undefined' ? false : view.pivot;
	this.groups.pivot = ko.observable(pivot);
	var groups_on = typeof view.groups_on == 'undefined' ? false : view.groups_on;
	this.groups.on = ko.computed( function() { return dataModel.current.state() == 'analyze' } );


// Sorting
	this.sorts = ko.observableArray([]);
	this.sortRows = function(temp_field) {
// var t = new Date();
		this.reset();
		var _sorts = ko.toJS( this.sorts() );
		if( typeof temp_field != 'undefined' ) { 
			if( typeof temp_field == 'object' ){
				if( temp_field.constructor.name == 'Array' ){
					for (var i = temp_field.length - 1; i >= 0; i--){
						_sorts.push( temp_field[i] ); 
					};
				} else {
					_sorts.push( { field: temp_field.field, direction: temp_field.direction } ); 
				}
			} else {
				_sorts.push( { field: temp_field, direction: 'ASC' } ); 
			}
		}
		var flat_fields = fields().map(function(elem) { return elem.to_param;} );
		var sort_match = _sorts.filter( function(elem) { 
			var indx = flat_fields.indexOf( elem.field );
			if( indx > -1 ) { 
				elem._field = fields()[indx];
				return true;
			} else {
				return false;
			}
		});
		if( sort_match.length > 0 ) {
			rows().sort(
				function(a,b) {
					for( var i = 0; i < sort_match.length; i++ ) {
						var sort_field = sort_match[i]['field'], sort_direction = sort_match[i]['direction'], _field =  sort_match[i]['_field'];
						// Something to look up and reference when the field type is something weird would be helpful

						a_val = a[ sort_field ]() == undefined ? '' : a[ sort_field ]();
						b_val = b[ sort_field ]() == undefined ? '' : b[ sort_field ]();

						a_val = typeof a_val == 'string' ? a_val.toLowerCase() : a_val;
						b_val = typeof b_val == 'string' ? b_val.toLowerCase() : b_val;

						if( _field.field_type == 'date' ){
							var a_attempt = new Date(a_val), b_attempt = new Date(b_val);
							a_val =  a_attempt != 'Invalid Date' ? a_attempt :  new Date('1/1/1001');
							b_val = b_attempt != 'Invalid Date' ? b_attempt : new Date('1/1/1001');
						}
						
						

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
// var d = new Date();
// console.log('sorting: '+(d-t))
		}
	}
	this.addSort = function(sort) {
		sort = typeof sort == 'string' ? {field: ko.observable(sort), direction: ko.observable('ASC') } : {field: ko.observable(sort.field), direction: ko.observable(sort.direction) };
		this.sorts.push(sort);
	}
	if( typeof view.sorts != 'undefined' ) {
		if( typeof view.sorts == 'string' ) {
			this.addSort(view.sorts);
		} else {
			for (var i in view.sorts ) {
				this.addSort( view.sorts[i] );
			};
		}
		// this.sortRows();
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
			return this.name().replace(/ /g,'_').toLowerCase();
		} else {
			return ''
		}
	}
	this.slug = view.slug

// Goals
	this.goal = ko.observable({field: ko.observable(undefined), value: ko.observable('')});
	if( typeof view.goal != 'undefined' ) {
		if(  typeof view.goal.value != 'undefined' && !isNaN(parseInt(view.goal.value)) ) {
			this.goal().value(view.goal.value);
		}
		if(  typeof view.goal.field != 'undefined' ) {
			var pos = viewModel.pivotedRows().map(function(elem) {return elem.label+elem.name}).indexOf( view.goal.field.label+view.goal.field.name);
			this.goal().field = pos !== -1 ? ko.observable( viewModel.pivotedRows()[pos] ) : ko.observable( undefined ); 
		}
	}


	this.goal.label = ko.dependentObservable({ 
		read: function() {
			if( this.goal().field() == undefined || this.goal().value() == '' || this.goal().value() <= 0 || isNaN(parseInt(this.goal().value())) ) {
				return false;
			} else {
				return 'goal '+this.goal().field().long_label
			}
		},
		deferEvaluation: true 
	}, 
	this);
	this.goal.field = ko.dependentObservable({ 
		read: function() {
			if( this.goal().field() == undefined ) {
				return '';
			} else {
				return this.goal().field().to_param;
			}
		},
	deferEvaluation: true 
	}, 
	this);
	
	this.pivotValues = ko.dependentObservable({ 
		read: function() {
			var options = ko.toJS(viewModel.pivotedRows());
			if( this.goal.label() ) {
				_goal = ko.toJS(this.goal().field() );
				_goal.long_label = this.goal.label();
				_goal.label = 'goal';
				options.push(_goal);
			}
			return options; 
		},
	deferEvaluation: true 
	}, 
	this);

	//  For the pivot table and groups
	if( view.report_on != null ) {
		var pos = this.pivotValues().map(function(elem) { return elem.name+elem.label}).indexOf( view.report_on.name+view.report_on.label ),
			report_on = view.report_on;
		
		report_on = pos === -1 ? undefined : this.pivotValues()[pos];
		this.reportOn = ko.observable(report_on);
	} else {
		this.reportOn = ko.observable(undefined);
	}

// Flatten and Dirty Flag
	this._flatten = function(return_type) {
		var returnable = new Object;
		returnable.name = this.name,
			returnable.id = this.id;
//			returnable.report_on = this.reportOn,
//			returnable.pivot = this.groups.pivot();

		if( typeof this._destroy != 'undefined' ) { returnable._destroy = true; }

		if( typeof this.goal == 'function' ) { 
			returnable.goal = this.goal().value() == '' && ( this.goal().field() == '' ||  this.goal().field() == undefined ) ? '' : this.goal();
		} else { 
			returnable.goal = this.goal.value == '' && ( this.goal.field == '' ||  this.goal.field == undefined ) ? '' : this.goal;
		}

		if( typeof this.sorts == 'function' ) { returnable.sorts = this.sorts().filter(function(elem){ return elem.field() != '' && elem.field() != undefined }); } else { returnable.sorts = this.sorts.filter(function(elem){ return elem.field != '' }); }
		returnable.filters = _flatten( this.filters() );
		returnable.groups = _flatten( this.groupings() );

		if( return_type == 'json' ) {return ko.toJSON( returnable );}
		else { return ko.toJS( returnable ); }
	}

	this.dirtyFlag = new ko.dirtyFlag(this);

	return this;
	
	function _flatten(flattener) {
		var returning = []
		for (var i=0; i < flattener.length; i++) {
			returning.push( flattener[i]._flatten() );
		};
		return returning;
	}
}