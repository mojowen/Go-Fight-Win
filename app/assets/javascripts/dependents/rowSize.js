dataModel.rowSize = ko.dependentObservable(
	{ read: function() {
		var t = new Date();
		if( dataModel.loaded ) {
			var d = new Date();
			console.log('rowSave: '+(d-t));
			return rows().length
		} else {
			if( typeof _size == 'undefined ') {
				var d = new Date();
				console.log('rowSave: '+(d-t));
				return rows().length;
			} else {
				var d = new Date();
				console.log('rowSave: '+(d-t));
				return _size;
			}
		}
	}, 
	deferEvaluation: true,
},
dataModel);