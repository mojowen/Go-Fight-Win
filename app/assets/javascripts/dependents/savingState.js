dataModel.savingState = ko.dependentObservable(
	{ read: function() {
		var text, enabled = true, prefix = '';
		if( !saving() ) {
			text = 'saving...';
			enabled = false;
		} else if ( dataModel.savingViews().length > 0 && dataModel.savingRows().length > 0  ) {
			text = 'much unsaved';
		} else if ( dataModel.savingViews().length > 0 ) {
			plurl = dataModel.savingViews().length == 1 ? '' : 's'
			prefix = dataModel.savingViews().length == 1 ? 'an' : ''
			text = 'unsaved view'+plurl;
		} else if ( dataModel.savingRows().length > 0   ) {
			plurl = dataModel.savingRows().length == 1 ? '' : 's'
			prefix = dataModel.savingRows().length == 1 ? 'an' : ''
			text = 'unsaved row'+plurl;
		} else {
			text = 'saved'
		}
		return {text: text, enabled: enabled, prefix: prefix}
	}, 
	deferEvaluation: true
},
dataModel);