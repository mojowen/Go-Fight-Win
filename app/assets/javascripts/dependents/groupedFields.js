viewModel.groupedFields = ko.dependentObservable({ 
	read: function() {
		var t = new Date();

		var _fields = fields(), grouped_fields = currentView().groups().map(function(elem) {return elem.field(); });


		_fields = grouped_fields.map(function(elem) {return {name: elem, report: "_val" }; }).concat(_fields.filter(function(elem) { return  grouped_fields.indexOf(elem.name) === -1; }));

		// switch(grouped_fields.length) {
		// 	case 1:
		// 		_fields = [{name: grouped_fields[0], report: '_val'} ].concat(_fields.filter(function(elem) { return elem.name != grouped_fields[0] }));
		// 		break;
		// 	case 1:
		// 		_fields = [{name: grouped_fields[0], report: '_val'} ].concat(_fields.filter(function(elem) { return elem.name != grouped_fields[0] }));
		// 		break;
		// 	
		// }

		var d = new Date();
		console.log('groupedFields: '+(d-t));

		return _fields;

	},
	deferEvaluation: true 
}, 
viewModel);

// I should put flatten in here