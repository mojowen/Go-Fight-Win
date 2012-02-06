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
	$('.grid th').live('click',function() {
		var ctx = ko.contextFor(this);
		var field = ctx.$data, direction = $(this).data('direction');
		if( direction == null ) {
			direction = 'ASC';
		} else {
			direction = direction == 'ASC' ? 'DESC' : 'ASC';
		}
		$(this).data('direction',direction);
		dataModel.current.view().sortRows({field: field.to_param, direction: direction});
	});
}