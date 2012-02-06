viewModel.availableGroups = ko.dependentObservable(
	{ read: function() {
		var flat_groups = dataModel.current.view().groups().map(function(elem) { return elem.field(); });
		var _fields = fields();
		if( typeof _operators != 'undefined' && typeof _operators.groupables != 'undefined' ) {
			_fields = _fields.filter(function(elem) { return _operators.groupables.indexOf(elem.to_param) > -1; });
		}
		if( flat_groups.length < 2 ) {
			return _fields.filter( function(field) { return flat_groups.indexOf(field.to_param) == -1; });
		} else {
			return [];
		}
		
	}, 
	deferEvaluation: true
},
viewModel);