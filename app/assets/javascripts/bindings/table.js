function table_template() {
	$('#edit_rows .remove').live('click', function(e) {
		e.preventDefault();
		clearSelection();
		var row = ko.dataFor(this);
		if( row.key() != 'new' ){
			rows.destroy(row); 
		} else {
			rows.remove(row); 
		}
	});
}