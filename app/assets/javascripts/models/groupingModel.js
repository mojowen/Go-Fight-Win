function groupingModel(data) {
	this.groups = ko.observableArray([]),
	this.pivot = ko.observable(false),
	this.report = ko.observable({name: 'contacts', report: 'sum'}),
	this.columns_reports = [];


	var $this = this;
	// Setting up the computed variables
	this.grouped = ko.computed( function() {
		var groups = ko.toJS($this.groups);
		if( dataModel.current.state() == 'analyze' && groups.length > 0 ) {
			var results = grouper(ko.toJS(viewModel.filteredRows),  groups, $this);
		} else {
			var results = {rows:[] };
			results = computer(results,{})
		}
		results.$grouping = $this;
		return results;
	});
	this.columns = ko.computed( {
		read: function() { 
			var groups = ko.toJS($this.groups),
				_fields = ko.toJS(fields), 
				grouped_fields = groups.map(function(elem) {return elem.field; });

			_fields = grouped_fields.map( function(elem) { 
				return {name: elem, report: "_val" }; 
			}).concat( 
				_fields.filter(function(elem) { 
					return  grouped_fields.indexOf(elem.to_param) === -1 && elem.fieldReports.length > 0; 
				})
			);
			if(  $this.pivot() && typeof $this.grouped()._uniques != 'undefined' && typeof $this.grouped()._uniques[1] != 'undefined' ) { 
				var _adjusted = [ {name: groups[0].field, report: "_val" } ].concat($this.grouped()._uniques[1].map( function(elem) { return { name: elem.display, report: 'all' } }) );
				return  _adjusted.concat( [{name: 'Totals', report: "_val" }] )
			} else { 
				return _fields.map(
					function(el) { 
						if( typeof el.report != 'string' ) {
							// This matches one of the stored filteredReports (which are internal to the column object's) to the report
							var saved = $this.columns_reports.filter(function(l) { return l.id == el.id; })[0],
								match = typeof saved != 'undefined' ? el.fieldReports.filter(function(l) { return l.long_label == saved.long_label; })[0] : undefined,
								report = match || el.report;
							el.report = ko.observable(report); 
						}
						return el; 
					}
				); 
			}
		}
	});
	this.available = ko.computed( function() {
		var groups = ko.toJS( $this.groups() ),
			flat_groups = groups.map(function(elem) { return elem.field; });

		var _fields = fields();

		if( typeof _operators != 'undefined' && typeof _operators.groupables != 'undefined' ) {
			_fields = _fields.filter(function(elem) { return _operators.groupables.indexOf(elem.to_param) > -1; });
		}
		if( flat_groups.length < 2 ) {
			return _fields.filter( function(field) { return flat_groups.indexOf(field.to_param) == -1; });
		} else {
			return [];
		}
	});
	this.pivotedReports = ko.dependentObservable( function() {
				var _fields = fields();
				var options = [];

				for (var i=0; i < _fields.length; i++) {
					var _field = _fields[i];
					if( typeof _operators != 'undefined' && typeof _operators.goalables != 'undefined' ) {
						var pos = _operators.goalables.map(function(elem) {return elem.field }).indexOf(_field.to_param);
						if( pos !== -1 ) {
							for (var ii=0; ii < _operators.goalables[pos].operations.length; ii++) {
								var report = _operators.goalables[pos].operations[ii].report,
									label = _operators.goalables[pos].operations[ii].label == undefined ? report : _operators.goalables[pos].operations[ii].label;

									var long_label = label+' '+_field.plural;
									long_label = long_label.capitalize();
									options.push( {label: label, name: _field.to_param, report: report, long_label: long_label } );
							};
						}
					} else {
						options = options.concat(_field.fieldReports())
					}
				};

			return options;
	});

	this._flatten = function() {
		var returning = new Object,
			saving = ['groups','pivot','report'];
		for (var i = saving.length - 1; i >= 0; i--){
			returning[ saving[i] ] = this[ saving[i] ];
		};
		// Saving the individual field reports
		returning.columns = [];
		for (var i=0; i < this.columns().length; i++) {
			if( typeof this.columns()[i].report == 'function' ) {
				returning.columns.push( this.columns()[i].report );
			}
		};
		return ko.toJS(returning);
	}
	
	
	// Building the groups 
	if( typeof data != 'undefined' ){
		if ( typeof data.groups != 'undefined' ){
			// new group
			for (var i in data.groups){
				this.groups.push(new groupModel(data.groups[i]));
			};
			this.pivot( data.pivot == 'true' );
			this.report( data.report );
			if( typeof data.columns != 'undefined' ) { 
				for(var i in data.columns ){
					this.columns_reports.push(data.columns[i]); 
				}
			}
		} else {
			// old group
			this.groups.push(new groupModel(data));
		}
	}

	this.$grouping = this;
	return this;
}