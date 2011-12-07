function fieldModel(data) {

	if( data.Field || data.field ) { var field = data.field || data.Field; }
	else { var field = data; }

	// Setting up key properties
	if( typeof field.id == 'undefined' ||typeof field.name == 'undefined' ) { throw new Error("mising some vital field data"); }
	this.list = field.list;
	this.name = field.name;
	this.id = field.id;

	this.field_type = field.field_type || 'text';
	this.field_options = field.field_options || '';

	this.fieldReports = ko.dependentObservable({ 
		read: function() {

			var options = [];
			options.push( {label: 'count', name: field.name, report: 'count' } );
			options.push( {label: 'unique', name: field.name, report: 'unique' } );

			switch(field.type) {
				case 'number': 
					options.push( {label: 'sum', name: field.name, report: 'sum' } );
					options.push( {label: 'avg', name: field.name, report: 'average' } );
					options.push( {label: 'max', name: field.name, report: 'max' } );
					options.push( {label: 'min', name: field.name, report: 'min' } );
					break;
				default:
					break;
			}
			for (var i=0; i < options.length; i++) {
				options[i]['long_label'] = options[i].label+': '+options[i].name;
			};

			return options;

		},
		deferEvaluation: true 
	}, 
	this);

	this.report = ko.observable( {label: 'count', name: field.name, report: 'count', long_label: 'count: '+this.name } );

	return this;
}