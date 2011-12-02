viewModel.groupedFields = ko.dependentObservable({ 
	read: function() {
		var t = new Date();

		var _fields = fields(), grouped_fields = currentView().groups().map(function(elem) {return elem.field(); });

		_fields = grouped_fields.map(function(elem) { return {name: elem, report: "_val" }; }).concat(_fields.filter(function(elem) { return  grouped_fields.indexOf(elem.name) === -1; }));


		var d = new Date();
		console.log('groupedFields: '+(d-t));

		if( pivot() && typeof viewModel.groupedRows()._uniques[1] != 'undefined' ) { 
			var _adjusted = [ {name: currentView().groups()[0].field(), report: "_val" } ].concat(viewModel.groupedRows()._uniques[1].map( function(elem) { return { name: elem.display, report: 'all' } }) );
			return  _adjusted.concat( [{name: 'Totals', report: "_val" }] )
		} else { return _fields; }

	},
	deferEvaluation: true 
}, 
viewModel);

// I should put flatten in here