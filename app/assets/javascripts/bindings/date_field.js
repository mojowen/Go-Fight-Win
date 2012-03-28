function date_fields (argument) {
	
	//  Generic function to test whether a value is a date, returns 'true' if it isn't
	function testDate(val) {
		return val == '' || val == '--' || val == 'Invalid Date' || val == 'null' || val == undefined;
	}
	
	//  Generic function used to open a date box
	function openDateBox(textbox){
		// textbox var should be a jquery object of the textarea we're wanting to mess with
		var $this = textbox;
		if( $this.hasClass('open') ) {
			var ctx = ko.contextFor($this[0]);
			var row = ctx.$parent, field = ctx.$data;
			var val = row[field.to_param](), observable = row[field.to_param];

			$('.hasDatepicker').datepicker('destroy').prev('.cal').removeClass('on');
			$this.next('.date_controls').find('.cal').addClass('on').next('.date_picker')
			.datepicker(
				{ 
					dateFormat: 'D M dd yy',
					altField: $this,
					closeText: 'X',
					showButtonPanel: true
				}
			)
			.datepicker('setDate', new Date(val) )
			.click( // This is what fires when clicking on a date
				function(e) {
						var $target = $(e.target);
						if( $target.is('a') || $target.is('td:not(".ui-datepicker-unselectable")') ) { $.datepicker.updateKnockout( $this, ctx ); }
				}
			);

			if( testDate(val) ) { $this.val('--') }
			$this.focus();
		}
	}

	/** Date **/
	// 		- set and save grouping options as part of group objects
	// 		- maybe some sort of 'duration' calculation 

	// Function for changing a date
	function date_change(val,day_change,month_change) {
		var date = val.constructor.name != 'Date' ? new Date(val) : val;
		if( val == '' ) { return new Date(); }
		var day_change = day_change || 0;
		var month_change = month_change || 0;
		if( date == 'Invalid Date' ) { 
			warn('not a date, chief');
			return val;
		} else {
			changed_date = new Date(date.getFullYear(),date.getMonth()+month_change, (date.getDate()+day_change) );
			// having trouble paging down to invalid dates
			$('.date_picker[id^=]').datepicker("setDate", changed_date );
			return changed_date;
		}
	}
	
	$('.date_picker').live({
		keyup: function(e){
			var $this = $(this);
			e.preventDefault();
			switch(e.keyCode){
				case 9:
					$this.datepicker("destroy").prev('.cal').removeClass('on');
					var target = $this.parents('td').next('td').find('textarea, select')
					target.focus();
					break;
				case 13:
					$this.next('.date_controls').find('.date_picker').datepicker("destroy").prev('.cal').removeClass('on');
					break;
				default:
					$this.datepicker("destroy").prev('.cal').removeClass('on');
			}
		}
	});
	$(".data.date").live({
		change: function(e) {
			var $this = $(this);
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			// console.log(event.target.value )
			// row[field.to_param]( new Date(event.target.value) );
			$this.next('.date_controls').find('.date_picker').datepicker("destroy").prev('.cal').removeClass('on');
		},
		keydown: function(e) {
			var $this = $(this);
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			val = row[field.to_param]();
			if( testDate(val) ) { val = new Date().toDateString(); }
			switch(e.keyCode){
				case 38:
					e.preventDefault();
					row[field.to_param]( date_change(val,1) );
					break;
				case 40: 
					e.preventDefault();
					row[field.to_param]( date_change(val,-1) );
					break;
				case 33: 
					e.preventDefault();
					row[field.to_param]( date_change(val,0,1) );
					break;
				case 34: 
					e.preventDefault();
					row[field.to_param]( date_change(val,0,-1) );
					break;
				case 13:
					e.preventDefault();
					$('.hasDatepicker').datepicker('destroy').prev('.cal').removeClass('on');
					break;
			}
		},
		open: function(e) {
			openDateBox( $(this) );
			e.preventDefault();
		}
	});

	$('.date_controls .cal').live({ 
		click: function(e) {
			var $this = $(this);
			if( $this.hasClass('on') ) {
				$this.removeClass('on').next('.date_picker').datepicker("destroy");
			} else {
				$this.parents('td').addClass('selected').find('textarea').addClass('open')
				openDateBox( $(this).parent().prev('textarea') );
				e.preventDefault();
			}
		}
	});
}

ko.bindingHandlers.datepicker = {
	  init: function(element, valueAccessor, allBindingsAccessor) { 
 		var attempt = valueAccessor().constructor.name == 'Date' ? valueAccessor() : new Date( valueAccessor() );
 		var val = attempt == 'Invalid Date' ?  function() { return  '--'; }  : function() { return attempt.toDateString(); }  ;
 		ko.bindingHandlers.value.update(element, val); 
 	}
 	,
 	update: function(element, valueAccessor, allBindingsAccessor) { 
 		var attempt = valueAccessor().constructor.name == 'Date' ? valueAccessor() : new Date( valueAccessor() );
 		var val = attempt == 'Invalid Date' ?  function() { return  '--'; }  : function() { return attempt.toDateString(); }  ;
 		ko.bindingHandlers.value.update(element, val);
 	}
};


$.extend($.datepicker, { updateKnockout: function (obj, ctx) {
	var row = ctx.$parent, field = ctx.$data;
	row[field.to_param]( obj.val() );
	obj.next('.date_controls').find('.date_picker').datepicker("destroy").prev('.cal').removeClass('on');
}});
