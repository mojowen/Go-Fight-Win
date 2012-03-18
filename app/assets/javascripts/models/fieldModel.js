function fieldModel(data) {

	if( data.Field || data.field ) { var field = data.field || data.Field; }
	else { var field = data; }

	// Setting up key properties
	if( typeof field.id == 'undefined' ||typeof field.name == 'undefined' ) { throw new Error("mising some vital field data"); }
	this.list = field.list;
	this.name = field.name.capitalize();
	if( typeof field.plural != 'undefined' ) {
		this.plural = field.plural.capitalize();
	} else {
		this.plural = field.name.capitalize();
	}
	this.to_param = field.name.replace(/ /,'_');
	this.id = field.id;

	this.field_type = field.field_type || 'text';
	this.field_options = field.field_options || '';
	//  Downcasing the select options
	if( this.field_type == 'select' || this.field_type == 'multiselect' ) {
		for (var i = this.field_options.length - 1; i >= 0; i--){
			this.field_options[i] = this.field_options[i].capitalize();
		};
	}
	if( this.field_type == 'children' ) {
		this.id = 0;
	}

	this.fieldReports = ko.dependentObservable({ 
		read: function() {

			var options = [];
			if( typeof _operators != 'undefined' && typeof _operators.computables != 'undefined' ) {
				var pos = _operators.computables.map(function(elem) {return elem.field }).indexOf(this.to_param);
				if( pos !== -1 ) {
					for (var i=0; i < _operators.computables[pos].operations.length; i++) {
						options.push( {label: _operators.computables[pos].operations[i].label, name: this.to_param, report: _operators.computables[pos].operations[i].report } );
					};
				}
			} else {

				options.push( {label: 'count', name: field.name, report: 'count', id: this.id } );
				options.push( {label: 'unique', name: field.name, report: 'unique', id: this.id } );

				switch(field.field_type) {
					case 'number': 
						options.push( {label: 'sum', name: field.name, report: 'sum', id: this.id } );
						options.push( {label: 'avg', name: field.name, report: 'average', id: this.id } );
						options.push( {label: 'max', name: field.name, report: 'max', id: this.id } );
						options.push( {label: 'min', name: field.name, report: 'min', id: this.id } );
						break;
					default:
						break;
				}
			}
			for (var i=0; i < options.length; i++) {
				options[i]['long_label'] = options[i].label+': '+this.plural;
				options[i]['long_label'] = options[i]['long_label'].capitalize();
			};
			return options;

		},
		deferEvaluation: true 
	}, 
	this);

	this.report = {label: 'count', name: field.name, report: 'count', long_label: 'Count: '+this.name.capitalize() };

	return this;
}