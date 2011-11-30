dataModel.rowSize = ko.dependentObservable(
	{ read: function() {
		if( dataModel.loaded ) {
			return rows().length
		} else {
			if( typeof _size == 'undefined ') {
				return rows().length;
			} else {
				return _size;
			}
		}
	}, 
	deferEvaluation: true,
},
dataModel);