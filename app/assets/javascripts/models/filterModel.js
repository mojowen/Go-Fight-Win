function filterModel(data) {
	var field, operator, filter, me;
	if( typeof data == 'string' ) {
		data = data.replace(' to','')
		if( data.search(/"/) !== -1 ) {
			data = data.split(/"/)[0];
			filter = data[1];
		}
		data = data.split(' ');
		field = data.shift();
		filter = filter || data.pop();
		operator = data.join(' ');
	} else {
		field = data.field || '';
		operator = data.operator || '';
		filter = data.filter || '';
	}

	this.field = ko.observable(field);
	this.operator = ko.observable(operator);
	this.filter = ko.observable(filter);
	me = this;
	
	this.obj = ko.computed( function() { 
		return fields().filter( function(el) { return el.to_param == me.field(); })[0];
	});
	this.options = ko.computed( function() { 
		var obj = me.obj();
		if( obj != undefined ) {
			switch( obj.field_type ) {
				case 'date':
					return ['is','is not','after','before','empty','not empty'];
					break;
				case 'number':
					return ['=','<>','>','<','>=','<=','empty','not empty'];
					break;
				default:
					return ['has','is','is not','empty','not empty'];
					break;
			}
		}
	});
	this.need_input = ko.computed( function() {
		var operator = me.operator();
		return operator != 'empty' &&  operator != 'not empty';
	});
	this._flatten = function() {
		var returning = ko.toJS(this);
		returning.obj = null;
		return returning;
	}
	
	return this;
}