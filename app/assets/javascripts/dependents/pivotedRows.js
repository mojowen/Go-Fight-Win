viewModel.pivotedRows = ko.dependentObservable({ 
	read: function() {

				var _fields = fields();
				var options = [];

				for (var i=0; i < _fields.length; i++) {
					var _field = _fields[i];
					if( typeof _operators != 'undefined' && typeof _operators.goalables != 'undefined' ) {
						var pos = _operators.computables.map(function(elem) {return elem.field }).indexOf(_field.to_param);
						if( pos !== -1 ) {
							for (var i=0; i < _operators.goalables[pos].operations.length; i++) {
								var report = _operators.goalables[pos].operations[i].report,
									label = _operators.goalables[pos].operations[i].label == undefined ? report : _operators.goalables[pos].operations[i].label;
								options.push( {label: label, name: _field.to_param, report: report } );
							};
						}
						for (var i=0; i < options.length; i++) {
							options[i]['long_label'] = options[i].label+' '+options[i].name.replace(/_/g, ' ')+'s';
							options[i]['long_label'] = options[i]['long_label'].toLowerCase();
						};
					} else {
						options = options.concat(_field.fieldReports())
					}
				};

			return options;
	},
	deferEvaluation: true 
}, 
viewModel);