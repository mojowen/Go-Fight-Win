viewModel.renderingRows = ko.computed(
	{ read: function() {
		var results = 
			dataModel.current.filtered() ? 
				viewModel.filteredRows().slice(dataModel.current.view().start(), dataModel.current.view().end()) :
				rows().slice(dataModel.current.view().start(), dataModel.current.view().end()) ;
		return results;
	}, 
	deferEvaluation: true
},
viewModel);