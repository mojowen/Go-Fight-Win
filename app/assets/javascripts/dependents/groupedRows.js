viewModel.groupedRows = ko.dependentObservable(
	{ read: function() {
		var t = new Date();
		if( stop()  ) {
			var results = grouper(ko.toJS(viewModel.filteredRows));
		} else {
			var results = {rows:[]};
			results = computer(results,{} )
		}
		var d = new Date();
		console.log("grouped: "+(d-t));
		return results;
	}, 
	deferEvaluation: true
},
viewModel);