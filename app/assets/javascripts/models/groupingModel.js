function groupingModel(data) {
	this.groups = ko.observableArray([]),
	this.pivot = ko.observable(false),
	this.report = ko.observable(null);

	// Building the groups 
	if( typeof data != 'undefined' ) {
		if( typeof data == 'string' || data.constructor.name != 'Array' ) {
			this.groups.push(new groupModel(data));
		} else {
			for (var i = data.length - 1; i >= 0; i--){
				this.groups.push(new groupModel(data[i]) );
			};
		}
	}

	var $this = this;
	// Setting up the computed variables
	this.grouped = ko.computed( function() {
		var groups = ko.toJS($this.groups);
		if( dataModel.current.state() == 'analyze' && groups.length > 0 ) {
			var results = grouper(ko.toJS(viewModel.filteredRows),  groups);
		} else {
			var results = {rows:[] };
			results = computer(results,{} )
		}
		return results;
	});
	this.columns = ko.computed( function() { 
		var groups = ko.toJS($this.groups),
			_fields = fields(), 
			grouped_fields = groups.map(function(elem) {return elem.field; });

		_fields = grouped_fields.map(function(elem) { return {name: elem, report: "_val" }; })
			.concat(_fields.filter(function(elem) { return  grouped_fields.indexOf(elem.to_param) === -1 && elem.fieldReports().length > 0; }));
		if(  $this.pivot() && typeof $this.grouped()._uniques[1] != 'undefined' ) { 
			var _adjusted = [ {name: groups[0].field, report: "_val" } ].concat($this.grouped()._uniques[1].map( function(elem) { return { name: elem.display, report: 'all' } }) );
			return  _adjusted.concat( [{name: 'Totals', report: "_val" }] )
		} else { return _fields; }

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
	})
	this.$grouping = this;
	return this;
}