viewModel.renderingRows = ko.computed(
	{ read: function() {
		var results = viewModel.filteredRows().slice(currentView().start(), currentView().end());
		return results;
	}, 
	deferEvaluation: true
},
viewModel);