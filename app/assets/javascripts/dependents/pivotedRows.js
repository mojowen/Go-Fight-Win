viewModel.pivotedRows = ko.dependentObservable({ 
	read: function() {
		// if( pivot() ) {
			var flat_groups = currentView().groups().map( function(groups) { return groups.field()}).filter(function(elem) { return elem != undefined && elem != '' });
			var _fields = fields().filter(function(elem) { return flat_groups.indexOf(elem.name ) === -1;  });
			var options = [];
			for (var i=0; i < _fields.length; i++) {
				options = options.concat(_fields[i].fieldReports())
			};
			return options;
		// } else {
			// return [];
		// }
	},
	deferEvaluation: true 
}, 
viewModel);