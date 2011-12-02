// dataModel.flatRows = ko.dependentObservable({ 
// 	read: function() {
// 		var t = new Date();
// 		// return ko.utils.arrayMap( rows(), 
// 		// 	function(row) {
// 		// 		var js_row = ko.toJS(row);
// 		// 		js_row.isDirty = row.dirtyFlag.isDirty() ? true : false;
// 		// 		return js_row;
// 		// 	}
// 		// );
// 		var d = new Date();
// 		console.log('flatRows: '+(d-t));
// 		// return [];
// 	},
// 	deferEvaluation: true 
// }, 
// dataModel);
// 
// // I should put flatten in here