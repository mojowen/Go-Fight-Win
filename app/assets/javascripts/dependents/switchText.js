viewModel.switchText = ko.dependentObservable(
	{ read: function() {
		if( dataModel.current.view().groups.on() ) {
			return 'Data';
		} else {
			return 'Analysis';
		}
	}, 
	deferEvaluation: true
},
viewModel);