dataModel.savingRows = ko.dependentObservable(
	{ read: function() {
			var t = new Date();
			var results = ko.utils.arrayFilter(rows(), 
				function(row) {
					return row.dirtyFlag.isDirty() || row._destroy;
				}
			);
			var d = new Date();
			console.log("saving: "+(d-t));
			return results;
			
	}, 
	deferEvaluation: true
},
dataModel);