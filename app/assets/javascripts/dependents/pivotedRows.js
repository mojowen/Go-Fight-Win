viewModel.pivotedRows = ko.dependentObservable({ 
	read: function() {

				var _fields = fields();
				var options = [];

				for (var i=0; i < _fields.length; i++) {
					var _field = _fields[i];
					if( typeof _operators != 'undefined' && typeof _operators.goalables != 'undefined' ) {
						var pos = _operators.goalables.map(function(elem) {return elem.field }).indexOf(_field.to_param);
						if( pos !== -1 ) {
							for (var ii=0; ii < _operators.goalables[pos].operations.length; ii++) {
								var report = _operators.goalables[pos].operations[ii].report,
									label = _operators.goalables[pos].operations[ii].label == undefined ? report : _operators.goalables[pos].operations[ii].label;

									var long_label = options[iii].label+' '+_field.plural;
									long_label = options[iii]['long_label'].toLowerCase();
									options.push( {label: label, name: _field.to_param, report: report, long_label: long_label } );
							};
						}
					} else {
						options = options.concat(_field.fieldReports())
					}
				};

			return options;
	},
	deferEvaluation: true 
}, 
viewModel);