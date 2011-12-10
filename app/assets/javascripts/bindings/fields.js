ko.bindingHandlers.datepicker = {
   init: function(element, valueAccessor, allBindingsAccessor) { 
		var attempt = new Date( valueAccessor() );
		var val = attempt == 'Invalid Date' ?  valueAccessor : function() { return valueAccessor().toDateString(); } ;
		
		var attempt = new Date( valueAccessor() );
		var val = attempt == 'Invalid Date' ?  valueAccessor : function() { return attempt.toDateString(); } ;

		ko.bindingHandlers.value.update(element, val);
	}
};


$.extend($.datepicker, { updateKnockout: function (obj, ctx) {
	var row = ctx.$parent, field = ctx.$data;
	row[field.name]( new Date( obj.val() ) );
	obj.next('.date_controls').find('.date_picker').datepicker("destroy");
	obj.focus();
}});


function fields_template (argument) {
	/** Autocomplete **/
	//	- can't be slow
	$('.suggest').live({
		focusin: function() {
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			var $this = $(this);
			$(this)
				.autocomplete({
					source: ko.utils.arrayGetDistinctValues(rows().map( function(elem) { return elem[field.name]() } )),
				});
		},
		focusout: function() {
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			row[field.name]( $(this).val() );
			if( $('.ui-autocomplete').is(':hidden') ) { $(this).autocomplete('destroy'); }
		}
	});
	
	
	/** Date **/
	// 		- set and save grouping options as part of group objects
	// 		- maybe some sort of 'duration' calculation 

	function date_change(val,day_change,month_change) {
		var date = val.constructor.name != 'Date' ? new Date(val) : val;
		if( val == '' ) { return new Date(); }
		var day_change = day_change || 0;
		var month_change = month_change || 0;
		if( date == 'Invalid Date' ) { 
			warn('not a date chief');
			return val;
		} else {
			changed_date = new Date(date.getFullYear(),date.getMonth()+month_change, (date.getDate()+day_change) );
			// having trouble paging down to invalid dates
			$('.date_picker[id^=]').datepicker("setDate", changed_date );
			return changed_date;
		}
	}
	$(".date").live({
		change: function(e) {
			var $this = $(this);
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			row[field.name]( new Date(event.target.value) );
			$this.next('.date_controls').find('.date_picker').datepicker("destroy");
		},
		keyup: function(e) {
			e.preventDefault();
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			var val = row[field.name]();
			switch(e.keyCode){
				case 38:
					row[field.name]( date_change(val,1) );
					break;
				case 40: 
					row[field.name]( date_change(val,-1) );
					break;
				case 33: 
					row[field.name]( date_change(val,0,1) );
					break;
				case 34: 
					row[field.name]( date_change(val,0,-1) );
					break;
				default:
					// console.log(e.keyCode);
			}
		},
		focusin: function(e) {
			e.preventDefault();
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			var val = row[field.name](), observable = row[field.name];
			
			var $this = $(this);
			$this.next('.date_controls').find('.cal').addClass('on').next('.date_picker')
			.datepicker(
				{ 
					defaultDate: val, 
					dateFormat: 'D M dd yy',
					altField: $this,
					closeText: 'X',
					showButtonPanel: true
				}
			)
			.click(
				function(e) {
						if( $(e.target).is('a') ) { $.datepicker.updateKnockout( $this, ctx ); }
				}
			);
		},
		focusout: function(e) {
			if( $('.ui-datepicker').is(':hidden') ) { $(this).next('.date_controls').find('.cal').removeClass('on').next('.date_picker').datepicker('destroy'); };
		}
	});
	clicked = 0;

	$('.date_controls .cal').live({ 
		click: function(e) {
			var $this = $(this);
			if( $this.hasClass('on') ) { $this.removeClass('on').next('.date_picker').datepicker('destroy') }
			else { $this.addClass('on').parent().prev('textarea').focus(); }
			
		// 	e.preventDefault();
		// 	var ctx = ko.contextFor(this);
		// 	var row = ctx.$parent, field = ctx.$data;
		// 	var val = row[field.name](), observable = row[field.name];
		// 	
		// 	var $this = $(this).toggleClass('on').next('.date_picker');
		// 	if( $this.hasClass('on') ) { 
		// 		$this.datepicker('destroy'); 
		// 	} else {
		// 		// destroys all over date pickers
		// 		$('.hasDatepicker').datepicker('destroy').prev('.on').removeClass('on');
		// 		$this
		// 			.datepicker(
		// 				{ 
		// 					defaultDate: val, 
		// 					dateFormat: 'D M dd yy',
		// 					altField: $this.parent().prev('textarea'),
		// 					closeText: 'X',
		// 					showButtonPanel: true
		// 				}
		// 			)
		// 			.click(
		// 				function(e) {
		//  							if( $(e.target).is('a') ) { $.datepicker.updateKnockout( $this.parent().prev('textarea'), ctx ); }
		// 				}
		// 			);
		// 	}
		}
	});
    
	/** Numbers **/
	function num_change(val,change) {
		if( val == '' || val == undefined ) { val = 0; }
		if( !isNaN(parseInt(val)) ) { 
			return parseInt(val) + change;
		} else {
			warn('not a number, chief');
			return val;
		}
	}
	$('.number').live({
		change: function(e) {
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			var val = row[field.name]();
			if( !isNaN(parseInt(val)) ) { row[field.name]( parseInt(val) ); }
		},
		keydown: function(e){
			var $number = $(this).parent().find('.number_controls')
			switch(e.keyCode){
				case 38:
					$number.find('.number_up').css('color','#747474');
					break;
				case 40: 
					$number.find('.number_down').css('color','#747474');
					break;
			}
		
		},
		keyup: function(e) {
			e.preventDefault();
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			var val = row[field.name]();
			var $number = $(this).parent().find('.number_controls')
			switch(e.keyCode){
				case 38:
					row[field.name]( num_change(val,1) );
					$number.find('.number_up').css('color','black');
					break;
				case 40: 
					row[field.name]( num_change(val,-1) );
					$number.find('.number_down').css('color','black');
					break;
				case 33: 
					row[field.name]( num_change(val,10) );
					break;
				case 34: 
					row[field.name]( num_change(val,-10) );
					break;
			}
		
		}
	});
	$('.number_controls .number_up').live('click',function(e) {
		e.preventDefault();
		clearSelection();
		var ctx = ko.contextFor(this);
		var row = ctx.$parent, field = ctx.$data;
		var val = row[field.name]();
		row[field.name]( num_change(val,1) );
	});
	$('.number_controls .number_down').live('click',function(e) {
		e.preventDefault();
		clearSelection();
		var ctx = ko.contextFor(this);
		var row = ctx.$parent, field = ctx.$data;
		var val = row[field.name]();
		row[field.name]( num_change(val,-1) );
	});
}

