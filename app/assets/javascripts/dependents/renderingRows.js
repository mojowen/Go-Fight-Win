viewModel.renderingRows = ko.dependentObservable(
	{ read: function() {
		var _rows = viewModel.groupedRows().rows;
		return _rows.slice(currentView.paged(), currentView.paged()+currentView.visible());
	}, 
	deferEvaluation: true
},
viewModel);