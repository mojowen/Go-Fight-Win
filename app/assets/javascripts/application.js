// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.

//= require jquery
//= require jquery-ui
//= require jquery_ujs
//= require knockout-latest.debug
//= require kinnect
//= require_tree ./lib
//= require_tree ./models
//= require_tree ./dependents
//= require_tree ./bindings
//= require_tree ./templates
//= require_tree ./non-list


window.onload=function() {
	if( typeof _list != 'undefined' ) {
// var t = new Date();
		load();
		setBindings();

		dataModel.current.table = new tableModel( viewModel.filteredRows, fields().concat( {name: 'menu',to_param: '_menu', field_type:'menu'}), {field: { name: 'name', data: 'to_param', type: 'field_type', options: 'field_options'}, widths: { ender: 100,field: 100 } })
		dataModel.current.table.bind({bind:false, template_source: ko.templates, element: document.getElementById('table')})

		dataModel.current.newTable = new tableModel( newRows, fields().concat( {name: 'menu',to_param: '_menu', field_type:'menu'}), {field: { name: 'name', data: 'to_param', type: 'field_type', options: 'field_options'}, widths: { ender: 100,field: 100 } })
		dataModel.current.newTable.bind({bind:false, template_source: ko.templates, element: document.getElementById('newTable')})


		ko.applyBindingsAndRegister(dataModel);

		
	} else {
		other_bindings();
	}
	good_other_bindings();
}