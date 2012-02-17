viewModel.renderingRows = ko.computed(
	{ read: function() {
		var results = viewModel.filteredRows().slice(dataModel.current.view().start(), dataModel.current.view().end()) ;
		return results;
	}, 
	deferEvaluation: true
},
viewModel);