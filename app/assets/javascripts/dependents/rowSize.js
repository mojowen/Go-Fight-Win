dataModel.rowSize = ko.dependentObservable(
	{ read: function() {
		return rows().length
		// if( dataModel.loaded ) {
		// 	var d = new Date();
		// 	return rows().length
		// } else {
		// 	if( typeof _size == 'undefined ') {
		// 		return rows().length;
		// 	} else {
		// 		return _size;
		// 	}
		// }
	}, 
	deferEvaluation: true,
},
dataModel);