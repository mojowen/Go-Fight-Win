viewModel.flatRows = ko.dependentObservable({ 
	read: function() {
		return ko.utils.arrayMap( rows(), 
			function(row) {
				var js_row = ko.toJS(row);
				js_row.isDirty = row.dirtyFlag.isDirty() ? true : false;
				return js_row;
			}
		);
	},
	deferEvaluation: true 
}, viewModel);