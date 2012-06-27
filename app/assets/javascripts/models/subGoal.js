function subGoal(data) {
	var data = data || {}
	this.enteredValue = ko.observable(data.enteredValue || 0)
	this.enteredDate = ko.observable( data.enteredDate || '')
	this.name = ko.observable( data.name ||  '')
	this.date = ko.computed( function() { 
		var date = this.enteredDate()
		if( date.length == 4 ) date = 'Jan 1 '+date
		return new Date( date )
	},this)
	this.enabled = ko.computed( function() { return this.date != 'Invalid Date' && this.enteredValue() > 0 },this)
}