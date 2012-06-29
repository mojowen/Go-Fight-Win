// Location
$(document).on({
	click: function(e) { e.preventDefault(); var ctx = ko.contextFor(this); $(this).locationMaker( ctx.$parent[ ctx.$data.to_param ] ).parent().addClass('open') },
	focus: function(e) { var ctx = ko.contextFor(this); $(this).locationMaker( ctx.$parent[ ctx.$data.to_param ] ).parent().addClass('open') }
},'.location:not(.open) textarea, .location:not(.open) .location_controller')

tableModel.__addTemplate('location','<textarea spellcheck="false" data-bind="value: $parent[$data.{data_field}]().address, valueUpdate: \'afterkeydown\', css: { located: $parent[$data.{data_field}]._located(), locating: !$parent[$data.{data_field}]._located() && $parent[$data.{data_field}]().address() != \'\', fail: $parent[$data.{data_field}]._fail() }" class="location"></textarea><div data-bind="css: { located: $parent[$data.{data_field}]._located() && !$parent[$data.{data_field}]._fail() }" class="field_controller location_controller"><img data-bind="src: $parent[$data.{data_field}]._preview()"></div>', 200);
