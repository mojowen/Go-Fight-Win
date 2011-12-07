viewModel.switchText = ko.dependentObservable(
	{ read: function() {
		if( currentView().groups.on() ) {
			return 'Data';
		} else {
			return 'Analysis';
		}
	}, 
	deferEvaluation: true
},
viewModel);