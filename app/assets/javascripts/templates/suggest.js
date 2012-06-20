// Suggest
$(document).on({
	focusin: function() {
		var ctx = ko.contextFor(this)
		$(this).autocomplete({
			source: ko.utils.arrayGetDistinctValues( rows().map( function(elem) { return elem[ ctx.$data.to_param]() } )),
			appendTo: $(this).parents('.body')
		});
	},
	focusout: function() {
		if( $('.ui-autocomplete').is(':hidden') ) { $(this).autocomplete('destroy'); }
	}
},'.suggest textarea')
tableModel.__addTemplate('suggest','<textarea class="suggest data " data-bind="value: $parent[$data.{data_field}], valueUpdate: \'afterkeydown\'"></textarea>');