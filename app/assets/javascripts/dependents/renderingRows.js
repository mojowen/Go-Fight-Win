viewModel.renderingRows = ko.dependentObservable(
	{ read: function() {
		return viewModel.groupedRows().rows;
	}, 
	deferEvaluation: true
},
viewModel);