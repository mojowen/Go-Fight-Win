function groupingModel(data) {
	this.groups = ko.observableArray([]),
	this.pivot = ko.observable(false),
	this.report = ko.observable({name: 'contacts', report: 'sum'}),
	this.columns_reports = [];

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


	// Building the groups 
	if( typeof data != 'undefined' ){
		if ( typeof data.groups != 'undefined' ){
			for (var i in data.groups){
				this.groups.push(new groupModel(data.groups[i]));
			};
			this.pivot( data.pivot == 'true' );
			if( data.report != 'undefined' ) {
				var report = this.pivotedReports().filter( function(el) { return el.id == parseInt(data.report.id) && el.report == data.report.report })[0];
				this.report( report );
			}
			if( typeof data.columns != 'undefined' ) { 
				for(var i in data.columns ){
					this.columns_reports.push(data.columns[i]); 
				}
			}
		} 
	}


	var $this = this;
	// Setting up the computed variables
	this.grouped = ko.computed( function() {
		var groups = ko.toJS($this.groups);
		if( dataModel.current.state() == 'analyze' && groups.length > 0 ) {
		if( dataModel.current.state() == 'analyze' ) {
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
							var saved = $this.columns_reports.filter(function(l) { return parseInt(l.id) == el.id; })[0],
								match = typeof saved != 'undefined' ? el.fieldReports.filter(function(l) { return l.long_label == saved.long_label; })[0] : undefined,
								report = match || el.report;
							// Setting the ID if it's not set
							if( typeof report.id == 'undefined' ) { report.id = el.id; }
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

	this._flatten = function() {
		var returning = new Object,
			saving = ['groups','pivot','report'];
		for (var i = saving.length - 1; i >= 0; i--){
			returning[ saving[i] ] = this[ saving[i] ];
		};
		// Saving the individual field reports
		returning.columns = [];
		for (var i=0; i < this.columns().length; i++) {
			if( typeof this.columns()[i].report == 'function' && !$this.pivot() ) {
				var flat_report = this.columns()[i].report();
				returning.columns.push( {long_label: flat_report.long_label, id: flat_report.id, name: flat_report.name,  report: flat_report.report} );
			}
		};
		return ko.toJS(returning);
	}
	
	

	this.$grouping = this;
	return this;
}