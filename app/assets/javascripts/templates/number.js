// Number
$(document).on('click','.number_controller span', function(e) { 
	var ctx = ko.contextFor(this), observable = ctx.$parent[ ctx.$data.to_param ], value = observable(), amount = $(this).hasClass('numberUp') ? 1 : -1
	if( value == '' ) value = 0
	if( isNaN(parseInt(value)) ) return false;
	observable(value+amount); 
	e.preventDefault(); 
});
tableModel.__addTemplate('number','<textarea class="number has_controls" wrap="off" data-bind="value: $parent[$data.{data_field}], valueUpdate: \'afterkeydown\'"></textarea><div class="number_controller field_controller"><span amount="1" class="numberUp">&#x2191;</span><span amount="-1" class="numberDown">&#x2193;</span></div>',80)
