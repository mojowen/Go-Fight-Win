dataModel.savingViews = ko.dependentObservable(
	{ read: function() {
			var changed_views = ko.utils.arrayFilter(views(), 
				function(view) {
					return view.dirtyFlag.isDirty() || view._destroy;
				}
			);
			return changed_views.map( function(view) { return view._flatten });
	}, 
	deferEvaluation: true
},
dataModel);