dataModel.savingState = ko.dependentObservable(
	{ read: function() {
		var text, enabled = true;
		if( !saving() ) {
			text = 'saving...';
			enabled = false;
		} else if ( dataModel.savingViews().length > 0 && dataModel.savingRows().length > 0  ) {
			text = 'much unsaved';
		} else if ( dataModel.savingViews().length > 0 ) {
			text = 'unsaved views';
		} else if ( dataModel.savingRows().length > 0   ) {
			text = 'unsaved rows';
		} else {
			text = 'saved'
		}
		return {text: text, enabled: enabled}
	}, 
	deferEvaluation: true
},
dataModel);