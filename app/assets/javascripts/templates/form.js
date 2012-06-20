ko.templates['form'] ='<div class="body" data-bind="template: {name: \'formRow\', foreach: fields}"></div>'
ko.templates['formRow'] = '<div class="row"><div class="label"><label data-bind="text: $data.name"></label></div><div class="input" data-bind="template: { name: $data.field_type }, addClass: $data.field_type"></div></div>'
// 
// ko.bindingHandlers.gfForm = {  init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) { 
// 	var all = allBindingsAccessor(),
// 		value = valueAccessor()
// 	all.template = {name: 'gfForm', foreach: value}
// 	$(element).addClass('gfForm')
// }}