// Date
$(document).on({
	click: function(e) { e.preventDefault(); var ctx = ko.contextFor(this); $(this).dateMaker( ctx.$parent[ ctx.$data.to_param ] ).parent().addClass('open') },
	focus: function(e) { var ctx = ko.contextFor(this); $(this).dateMaker( ctx.$parent[ ctx.$data.to_param ] ).parent().addClass('open') }
},'.date:not(.open) textarea, .date:not(.open) .date_controller')

tableModel.__addTemplate('date','<textarea spellcheck="false" data-bind="value: $parent[$data.{data_field}], valueUpdate: \'afterkeydown\', elastic: true" class="date"></textarea><div class="field_controller date_controller"></div>', 140);
