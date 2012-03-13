appDataModel.fields_template = function(argument) {
	date_fields();

	/** Autocomplete **/
	//	- can't be slow
	$('.open.suggest').live({
		focusin: function() {
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			var $this = $(this);
			$(this)
				.autocomplete({
					source: ko.utils.arrayGetDistinctValues(rows().map( function(elem) { return elem[field.to_param]() } )),
				});
		},
		focusout: function() {
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			row[field.to_param]( $(this).val() );
			if( $('.ui-autocomplete').is(':hidden') ) { $(this).autocomplete('destroy'); }
		}
	});
	
	
	function closeAutoSuggest() {
		$('.ui-autocomplete-input').autocomplete('destroy');
	}
	/** Multiselect **/
	var multiselect_options = { 
		header: true, 
		selectedList: 5, 
		minWidth: 'auto',
		height: 'auto',
		close: function() { 
			closeMultiSelect(this);
		} 
	}

	$('.selected .trigger_multiselect').live('click', function(e) {
		$(this).hide().next('select.multiselect').multiselect(multiselect_options);
	});

    function closeMultiSelect() {
		$('button.ui-multiselect').removeClass('open').not('.trigger_multiselect').prev('select').multiselect('destroy').removeClass('open').hide().prev('.trigger_multiselect').removeClass('open').show();
	}
	
	/*** Scroll which kills multiselect and auto-suggest ***/
	$('#scrolling').scroll( function() {
		closeMultiSelect();
		closeAutoSuggest();
	});

	/** Numbers **/
	function num_change(val,change) {
		if( val == '' || val == undefined ) { val = 0; }
		if( !isNaN(parseInt(val)) ) { 
			return parseInt(val) + change;
		} else {
			warn('not a number, cheif');
			return val;
		}
	}
	$('.number').live({
		change: function(e) {
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			var val = row[field.to_param]();
			if( !isNaN(parseInt(val)) ) { row[field.to_param]( parseInt(val) ); }
		},
		keydown: function(e){
			var $number = $(this).parent().find('.number_controls')
			switch(e.keyCode){
				case 38:
					e.preventDefault();
					$number.find('.number_up').css('color','#747474');
					break;
				case 40: 
					e.preventDefault();
					$number.find('.number_down').css('color','#747474');
					break;
			}
		
		},
		keyup: function(e) {
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			var val = row[field.to_param]();
			var $number = $(this).parent().find('.number_controls')
			switch(e.keyCode){
				case 38:
					e.preventDefault();
					row[field.to_param]( num_change(val,1) );
					$number.find('.number_up').css('color','black');
					break;
				case 40: 
					e.preventDefault();
					row[field.to_param]( num_change(val,-1) );
					$number.find('.number_down').css('color','black');
					break;
				case 33: 
					e.preventDefault();
					row[field.to_param]( num_change(val,10) );
					break;
				case 34: 
					e.preventDefault();
					row[field.to_param]( num_change(val,-10) );
					break;
			}
		
		}
	});
	$('.number_controls .number_up').live('click',function(e) {
		e.preventDefault();
		clearSelection();
		var ctx = ko.contextFor(this);
		var row = ctx.$parent, field = ctx.$data;
		var val = row[field.to_param]();
		row[field.to_param]( num_change(val,1) );
	});
	$('.number_controls .number_down').live('click',function(e) {
		e.preventDefault();
		clearSelection();
		var ctx = ko.contextFor(this);
		var row = ctx.$parent, field = ctx.$data;
		var val = row[field.to_param]();
		row[field.to_param]( num_change(val,-1) );
	});
}

