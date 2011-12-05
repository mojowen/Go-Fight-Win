viewModel.pivotedRows = ko.dependentObservable({ 
	read: function() {
			var flat_groups = currentView().groups().map( function(groups) { return groups.field()}).filter(function(elem) { return elem != undefined && elem != '' });
			var _fields = fields().filter(function(elem) { return flat_groups.indexOf(elem.name ) === -1;  });
			var options = [];
			for (var i=0; i < _fields.length; i++) {
				options = options.concat(_fields[i].fieldReports())
			};
			if(  currentView().goal().field() != '' && currentView().goal().field() != undefined &&  options.indexOf(currentView().goal().field()) === -1  ){
				var options_mapped = options.map(function(elem) { return elem.long_label; });
				var pos = options_mapped.indexOf(currentView().goal().field().long_label);
				if( pos !== -1 ){
					currentView().goal().field( options[ pos ] );
				} else {
					options.push( currentView().goal().field() );
				}
			}
			if(  currentView().reportOn() != undefined && options.indexOf(currentView().reportOn()) === -1  ){
				var options_mapped = options.map(function(elem) { return elem.long_label; });
				var pos = options_mapped.indexOf(currentView().reportOn().long_label);
				if( pos !== -1 ){
					currentView().reportOn( options[ pos ] );
				} else {
					options.push( currentView().reportOn() );
				}
			}
			return options;
	},
	deferEvaluation: true 
}, 
viewModel);