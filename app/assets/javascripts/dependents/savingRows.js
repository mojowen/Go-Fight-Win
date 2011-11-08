viewModel.savingRows = ko.dependentObservable(
	{ read: function() {
			return ko.utils.arrayFilter(viewModel.flatRows(), 
				function(row) {
					return row.isDirty || row._destroy;
				}
			);
	}, 
	deferEvaluation: true
},
viewModel);