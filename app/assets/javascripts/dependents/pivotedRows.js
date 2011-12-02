viewModel.pivotedRows = ko.dependentObservable({ 
	read: function() {
		if( pivot() ) {
			var flat_groups = currentView().groups().map( function(groups) { return groups.field()}).filter(function(elem) { return elem != undefined && elem != '' });
			var _fields = fields().filter(function(elem) { return flat_groups.indexOf(elem.name ) === -1;  });
			var options = [];
			for (var i=0; i < _fields.length; i++) {
				options.push( {label: 'count: '+_fields[i].name, name: _fields[i].name, report: 'count' } );
				options.push( {label: 'count #s: '+_fields[i].name, name: _fields[i].name, report: 'count_int' } );
				options.push( {label: 'unique: '+_fields[i].name, name: _fields[i].name, report: 'unique' } );
				switch(_fields[i].type) {
					case 'number': 
						options.push( {label: 'sum: '+_fields[i].name, name: _fields[i].name, report: 'sum' } );
						options.push( {label: 'avg: '+_fields[i].name, name: _fields[i].name, report: 'average' } );
						options.push( {label: 'max: '+_fields[i].name, name: _fields[i].name, report: 'max' } );
						options.push( {label: 'min: '+_fields[i].name, name: _fields[i].name, report: 'min' } );
						break;
					default:
						break;
				}
			};
			return options;
		} else {
			return [];
		}
	},
	deferEvaluation: true 
}, 
viewModel);