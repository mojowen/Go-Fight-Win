function newRow_template() {
	newRows.push( new rowModel({key: 'new', list: _list})  );

	$('#new_row textarea').live('paste', function (e) {
		var the = $(this)
		setTimeout(function() {
			data = the.val().split(/\n/);
			var start = the.index('#new_row textarea')
			for (var i=0; i < data.length; i++) {
				if( data[i].length > 0 ) {
					if( typeof newRows()[i] == 'undefined' ) { newRows.push( new rowModel({key: 'new', list: _list})  ); }
					fillRow( data[i], start,i);
				}
			};
			$('#new_row tr:last textarea:first').focus();
		}, 0);
		
	});

	$('#new_row textarea').live('keypress', function (e) {
		if ( e.keyCode == 13 ) {
			e.preventDefault();
			for (var i=0; i < newRows().length; i++) {
				addRow( newRows()[i] )
			};
			newRows.removeAll();
			newRows.push( new rowModel({key: 'new', list: _list})  );
			$('#new_row tr:last textarea:first').focus();
		}
	});

	$('#new_row .add').live('click', function() {
		var row = ko.dataFor(this);
		addNewRow( row );
	});
	$('#new_row .remove').live('click', function() {
		var row = ko.dataFor(this);
		removeNewRow(row);
	});
}

function addNewRow( row ) {
	addRow( row );
	newRows.remove(row);
	if( newRows().length == 0 ) {
		newRows.push( new rowModel({key: 'new', list: _list})  );
	}
	$('#new_row tr:last textarea:first').focus();
}
function removeNewRow(row) {
	newRows.remove(row);
	if( newRows().length == 0 ) {
		newRows.push( new rowModel({key: 'new', list: _list})  );
	}
}

function fillRow(rowData,x,y) {
	var split = rowData.split(/\t/);
	var y = typeof y == 'undefined' ? 0 : y;
	for (var i=0; i < split.length; i++) {
		if( typeof fields()[x+i] != 'undefined' ) {
			newRows()[y][fields()[x+i].name](split[i])
		}
	};
}
