viewModel.renderingRows = ko.dependentObservable(
	{ read: function() {
		var _rows = viewModel.groupedRows().rows;
		return _rows;
	}, 
	deferEvaluation: true
},
viewModel);