appDataModel.fields_template = function(argument) {
	date_fields();
	i = 0;
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
					appendTo: '#scrolling'
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
	function multiselect() {
		return { 
			header: '<li class="other"><a class="ui-multiselect-all" href="#"><span>+ Check all</span></a></li><li class="other"><a class="ui-multiselect-none" href="#"><span>- Uncheck all</span></a></li>',
			selectedList: 1, 
			appendTo: '#scrolling',
			position: {my: 'left top', at: 'left bottom', collision: 'none none' },
			minWidth: 'auto',
			height: 'auto',
			close: function() { 
				closeMultiSelect(this);
			}
		}
	};
	var multiselect_options = new multiselect, select_options = new multiselect;
	select_options.multiple = false;

	$(document).on('open', '.trigger_betterselect', function(e) {
		var $this = $(this);
		multiselect_options.appendTo = $this.parents('.scroller, .form'), select_options.appendTo = $this.parents('.scroller, .form');
		if( $this.parents('#edit_rows').length < 1 ) multiselect_options.autoOpen = true, select_options.autoOpen = true;
		$this.hide().next('select.multiselect').multiselect(multiselect_options);
		$this.hide().next('select.select').multiselect(select_options);
	});
	

    function closeMultiSelect() {
		$('button.ui-multiselect').removeClass('open').not('.trigger_betterselect').prev('select').multiselect('destroy').removeClass('open').hide().prev('.trigger_betterselect').removeClass('open').show();
	}
	

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
	$('.cell.number').live({
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
			i++;
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
	
	/** Blocks **/
	$('.grid textarea.block').live({
		open: function() {
			var $this = $(this),
				height = $this[0].scrollHeight > 25 ?  $this[0].scrollHeight + 9 : 25;
			$this.height( height ).next('.block_controls').show();
		},
		focusout: function() {
			$(this).height(25).next('.block_controls').hide();
		},
		keydown: function() {
			var $this = $(this),
				height = $this[0].scrollHeight > 25 ? $this[0].scrollHeight + 9 : 25;
			$this.height( height )
		}
	});
	
	/** Children **/
	$('div.children.empty').on('open',function() {
		$(this).trigger('closeCell');
	})
}

