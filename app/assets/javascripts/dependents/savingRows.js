dataModel.savingRows = ko.dependentObservable(
	{ read: function() {
			return ko.utils.arrayFilter(dataModel.flatRows(), 
				function(row) {
					return row.isDirty || row._destroy;
				}
			);
	}, 
	deferEvaluation: true
},
dataModel);