// Options used for multiselect and select
function multiselect() { return { 
	header: '<li class="other"><a class="ui-multiselect-all" href="#"><span>+ Check all</span></a></li><li class="other"><a class="ui-multiselect-none" href="#"><span>- Uncheck all</span></a></li>',
	selectedList: 1, 
	position: {my: 'left top', at: 'left bottom', collision: 'none none' },
	minWidth: 'auto',
	height: 'auto',
	autoOpen: true
}};
// Select
$(document).on({ click: function(e) {
	var options = new multiselect(),
		$element = $(this).hide().next('select')
	options.multiple = false
	options.appendTo = $element.parents('.body')
	$element.multiselect(options)
}},'.select button.trigger')
tableModel.__addTemplate('select','<button type="button" class="ui-multiselect trigger" aria-haspopup="true" tabindex="0" data-bind="text: !$parent[$data.{data_field}]  ? \'--\' : $parent[$data.{data_field}]() == null ? \'--\' : $parent[$data.{data_field}]"></button><select style="display: none;"  data-bind="betterSelect: true, value: $parent[$data.{data_field}], options: $data.{option_field}, optionsCaption: \'--\'" class="select"></select>',120);

// Multiselect
$(document).on({ click: function(e) {
	var options = new multiselect(),
		$element = $(this).hide().next('select')
	options.appendTo = $element.parents('.body')
	$element.multiselect(options)
}},'.multiselect button.trigger')
tableModel.__addTemplate('multiselect','<button type="button" class="ui-multiselect trigger" aria-haspopup="true" tabindex="0" data-bind="text: !$parent[$data.{data_field}] || $parent[$data.{data_field}]().length == 0 ? \'Select options\' : $parent[$data.{data_field}]().length > 1 ? $parent[$data.{data_field}]().length+\' selected\' : $parent[$data.{data_field}] "></button><select style="display: none;" multiple="true" data-bind="betterSelect: true, selectedOptions: $parent[$data.{data_field}], options: $data.{option_field}" class="multiselect"></select>',120);