function mapModel(options) {
	var options = options || {}

	this.rows = ko.computed( function() {
		if( dataModel.current.state() != 'analyze' ) return [];
		else return ko.toJS( viewModel.filteredRows )
	},this)

	var field = fields.locations().filter( function(el) { return el.id === parseInt(options.field) })[0]
	this.field = ko.observable( field || fields.locations()[0] )

	new gfMap()
	this.map =  gfMap.map.makeMap(this.rows,this.field().to_param, { obj: this.map,
	infoContent: function(row) { 
		var content = ''
		for (var i=0; i < fields().length; i++) {
			var field = fields()[i], value = ''
			switch(field.field_type) {
				case 'array':
					value = row[field.to_param].join(', ')
					break;
				case 'location':
					value = row[field.to_param].address
					break;
				default:
					value = row[field.to_param]
			}
			content+= '<strong>'+field.name +'</strong>: '+value+'<br />'
		}
		return content
	} })
	
	this._flatten = function() {
		return { field: this.field().id }
	}
	return this
}