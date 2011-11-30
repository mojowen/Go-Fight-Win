viewModel.availableGroups = ko.dependentObservable(
	{ read: function() {
		var flat_groups = currentView().groups().map(function(elem) { return elem.field(); });;
		var flat_fields = fields().map(function(field) { return field.name; });
		return flat_fields.filter( function(field) { return flat_groups.indexOf(field) == -1; });
	}, 
	deferEvaluation: true
},
viewModel);