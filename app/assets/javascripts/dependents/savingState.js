dataModel.savingState = ko.dependentObservable(
	{ read: function() {
		var text, enabled = true;
		if( !saving() ) {
			text = 'saving...';
			enabled = false;
		} else if ( dataModel.savingViews().length > 0 && dataModel.savingRows().length > 0  ) {
			text = 'much unsaved';
		} else if ( dataModel.savingViews().length > 0 ) {
			plurl = dataModel.savingViews().length == 1 ? '' : 's'
			text = 'unsaved view'+plurl;
		} else if ( dataModel.savingRows().length > 0   ) {
			plurl = dataModel.savingRows().length == 1 ? '' : 's'
			text = 'unsaved row'+plurl;
		} else {
			text = 'saved'
		}
		return {text: text, enabled: enabled}
	}, 
	deferEvaluation: true
},
dataModel);