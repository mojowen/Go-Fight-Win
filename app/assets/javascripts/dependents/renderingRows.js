viewModel.renderingRows = ko.computed(
	{ read: function() {
		var start = typeof dataModel.current.view().start != 'undefined' ? dataModel.current.view().start() : 0,
			end = typeof dataModel.current.view().end != 'undefined' ? dataModel.current.view().end() : 90,
			results = viewModel.filteredRows().slice(start,end)
		return results;
	}, 
	deferEvaluation: true
},
viewModel).extend({ throttle: 1 });