viewModel.groupedRows = ko.dependentObservable(
	{ read: function() {
		var t = new Date();
		var results = stop() ? grouper(ko.toJS(viewModel.filteredRows)) : [];
		var d = new Date();
		console.log("grouped: "+(d-t));
		return results;

	}, 
	deferEvaluation: true
},
viewModel);