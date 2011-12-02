viewModel.renderingRows = ko.dependentObservable(
	{ read: function() {
		var t = new Date();
		var results = viewModel.filteredRows().slice(currentView().paged(), currentView().paged()+currentView().visible());
		var d = new Date();
		console.log("render: "+(d-t));
		return results;
	}, 
	deferEvaluation: true
},
viewModel);