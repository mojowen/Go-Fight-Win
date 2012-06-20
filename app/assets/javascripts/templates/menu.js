// Menu
$(document).on({
	click: function(e) {
		var row = ko.contextFor(this).$parent;
		if( row.key() != 'new' ) rows.destroy(row)
		else rows.remove(row); 
	} 
},'.menu .remove')
tableModel.__addTemplate('menu','<div class="field_controller" data-bind="template: {name: $parent[$data.{data_field}]() } "></div>',90)
tableModel.__addTemplate('rowMenu','<span class="remove clickable">Delete</span>')
tableModel.__addTemplate('newRowMenu','<span class="add clickable">Add</span><span class="remove clickable">Discard</span>')
tableModel.__addTemplate('unsavedRowMenu','<span class="remove clickable">Discard</span>')
