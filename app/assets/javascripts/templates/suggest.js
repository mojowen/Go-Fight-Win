// Suggest
$(document).on({
	focusin: function() {
		var ctx = ko.contextFor(this)
		$(this).autocomplete({
			source: ko.utils.arrayGetDistinctValues( ctx.$root.rows().map( function(elem) { return elem[ ctx.$data[ ctx.$root.__options.field.data] ]() } )),
			appendTo: $(this).parents('.inner')
		});
	},
	focusout: function() {
		if( $('.ui-autocomplete').is(':hidden') ) { $(this).autocomplete('destroy'); }
	}
},'.suggest textarea')
tableModel.__addTemplate('suggest','<textarea class="suggest data " data-bind="value: $parent[$data.{data_field}], valueUpdate: \'afterkeydown\'"></textarea>');