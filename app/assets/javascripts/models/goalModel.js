function goalModel(options) {
	this.goal = ko.observable(0)
	this.name = ko.observable('My Goal')
	this.minUser = ko.observable()
	this.maxUser = ko.observable()
	this.subgoals = ko.observableArray([])
	this.subgoalsGood = ko.computed( function() { return this.subgoals().filter( function(el) { return el.enabled() }) }, this)
	

	this.stepper = stepper = { 
		day: 1,
		week: 7,
		month: 31,
		year: 366
	}

	this.stepper_function = {
		day: function(d) { return new Date(d.setDate(d.getDate() + 1 ) )},
		week: function(d) { return new Date(d.setDate(d.getDate() + 7 ) ) },
		month: function(d) { return new Date(d.setMonth(d.getMonth() + 1 ) ) },
		year: function(d) { return new Date(d.setFullYear(d.getFullYear() + 1 ) )}
	},
	

	this.field = ko.observable()
	this.date = ko.observable()
	this.dateGrouped = ko.computed( function() {
		var date = ko.toJS(this.date)
		return typeof date == 'undefined' ? []: [ new groupModel({field: date.to_param, option: this.option() }) ]
	}, this)
	this.option = ko.observable()


	this.groupedRows = ko.computed( function() {
		return grouper( ko.toJS(viewModel.filteredRows),  ko.toJS( this.dateGrouped ) ) ;
	},this)

	this.min = ko.computed(function() {
		if( typeof this.dateGrouped()[0] != 'undefined' ) {
			var rows = this.groupedRows().rows.filter(function(el) { return el._value !== "--" }), option = this.dateGrouped()[0].option(), user = this.minUser()
			user = typeof user != 'undefined' && option == 'year' && user.length == 4 ? new Date('Jan 1 '+user ) : new Date( user )
			if( user == 'Invalid Date') return Math.min.apply(Math, rows.map( function(el) { return option == 'year' ? new Date('Jan 1 '+el._value) : new Date(el._value) }))
			else return user
		} else return 0
	},this)

	this.max = ko.computed(function() { 
		if( typeof this.dateGrouped()[0] != 'undefined' ) {
			var rows = this.groupedRows().rows.filter(function(el) { return el._value !== "--" }), option = this.dateGrouped()[0].option(), user = this.maxUser()
			user = typeof user != 'undefined' && option == 'year' && user.length == 4 ? new Date('Jan 1 '+user ) : new Date( user )
			if( user == 'Invalid Date') return Math.max.apply(Math, rows.map( function(el) { return option == 'year' ? new Date('Jan 1 '+el._value) : new Date(el._value) }))
			else return user
		} else return 0;
	},this)

	this.diffs = ko.computed(function() { 
		return  {
			day: Math.ceil( (this.max() - this.min()) / ( 86400000 * this.stepper.day ) ),
			week: Math.ceil( (this.max() - this.min()) / ( 86400000 * this.stepper.week ) ),
			month: Math.ceil( (this.max() - this.min()) / ( 86400000 * this.stepper.month ) ),
			year: Math.ceil( (this.max() - this.min()) / ( 86400000 * this.stepper.year ) )
		}
	},this)

	this.diff = ko.computed( function() { 
		if( typeof this.dateGrouped()[0] != 'undefined' ) {
			var option = this.dateGrouped()[0].option()
			return this.diffs()[option]
		}
	},this)
	
	this.availableOptions = ko.computed(function() {
		var options = [], diffs = this.diffs()
		for( var i in diffs ) {
			if( diffs[i] < 28 ) options.push(i)
		}
		return options.reverse()
	},this)



	this.rows = ko.computed( function() {
		var field = ko.toJS( this.field )
		if( typeof field != 'undefined' ) {
			var rows = this.groupedRows()
			if( this.dateGrouped().length > 0 )  {
				var rows = rows.rows.filter(function(el) { return el._value !== "--" }),
					labels = rows.map( function(el) { return el._value })
					returning_rows = [], 
					option = this.dateGrouped()[0].option(),
					min = this.min(),
					max = this.max(),
					diff = this.diff(),
					summed = 0,
					start = new Date( min )

				if( diff < 20 && typeof option != 'undefined' ) for (var i=0; i < diff+1; i++) {
					var label = dateFormatter(option,start)

					var pos = labels.indexOf(label)
					if(  pos !== -1 ) {
						summed += rows[pos][ field.name ][ field.report ]
					}

					returning_rows.push( { sort: start, label: label, value: summed} )
					start = this.stepper_function[ option ](start)

				};

				return returning_rows
			} else return [{ value: rows[ field.name ][ field.report ], label: ''}]
		} else return []
	},this)

	this.line = ko.computed( function() {
		var goals = [], goal = parseFloat(ko.toJS(this.goal)), _rows = this.rows(), subgoals = this.subgoalsGood()
		if( typeof this.dateGrouped()[0] != 'undefined' && _rows.length > 0) {
			var option = this.dateGrouped()[0].option(),
				pos = subgoals.map( function(el) { return dateFormatter( option, el.date() ) }).indexOf(_rows[0].label)
			if( pos === -1 ) goals.push( {x: _rows[0].label, y: 0.00000001 } )
			for (var i=0; i < subgoals.length; i++) {
				var subgoal = subgoals[i]
				goals.push( {y:  subgoal.enteredValue, x: dateFormatter( option, subgoal.date() ) , dot: true, label: subgoal.name } )
			};
			goals.push( {x: _rows[_rows.length -1 ].label, y:this.goal, dot: true, label: this.name } )
		} else goals.push( {x: '', y: 0.00000001 }, {x:'', y:this.goal, dot: true, label: this.name } )
		return goals
	},this)

	this.graph =  new graphModel(
		this.rows, 
		{ 
			label: false, 
			sort: 'sort',
			width: 800,
			line: this.line
		}
	)

}