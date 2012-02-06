newRows.label = ko.dependentObservable(
	{ read: function() {
		if( newRows().length > 1 ) { return 'add '+newRows().length+' new rows' }
		else { return 'add new row' }
	}, 
	deferEvaluation: true
},
newRows);
newRows.plurl = ko.dependentObservable(
	{ read: function() {
		if( newRows().length > 1 ) { return 's' }
		else { return '' }
	}, 
	deferEvaluation: true
},
newRows);

function newRow_template() {
	newRows.push( new rowModel({key: 'new', list: _list })  );
	
	$('#new_row textarea').live('paste', function (e) {
		var the = $(this)
		setTimeout(function() {
			data = the.val().split(/\n/);
			the.val('');
			var start = the.index('#new_row textarea')
			for (var i=0; i < data.length; i++) {
				if( data[i].length > 0 ) {
					if( typeof newRows()[i] == 'undefined' ) { newRows.push( new rowModel({key: 'new', list: _list })  ); }
					fillRow( data[i], start,i);
				}
			};
		}, 0);
	});

	$('#new_row textarea, #new_row select').live('keypress', function (e) {
		if ( e.keyCode == 13 ) {
			e.preventDefault();
			addAllRows();
			$('#new_row tr:last td:first').find('textarea, select').focus();
		}
	});
	$('.add_new_rows').live('click',function(e) {
		addAllRows();
	});

	$('#new_row .add').live('click', function() {
		var row = ko.dataFor(this);
		addNewRow( row );
		notify('one new row added');
	});
	$('#new_row .remove').live('click', function() {
		var row = ko.dataFor(this);
		removeNewRow(row);
	});
	function addAllRows() {
		var adding = newRows().length;
		for (var i=0; i < adding; i++) {
			addRow( newRows()[i] );
		};
		newRows.removeAll();
		newRows.push( new rowModel({key: 'new', list: _list })  );
		notify(adding+ ' new rows added');
	}
}

function addNewRow( row ) {
	addRow( row );
	newRows.remove(row);
	if( newRows().length == 0 ) {
		newRows.push( new rowModel({key: 'new', list: _list })  );
	}
}
function removeNewRow(row) {
	newRows.remove(row);
	if( newRows().length == 0 ) {
		newRows.push( new rowModel({key: 'new', list: _list })  );
	}
}

function fillRow(rowData,x,y) {
	var split = rowData.split(/\t/),
		y = typeof y == 'undefined' ? 0 : y;
	for (var i=0; i < split.length; i++) {
		if( typeof fields()[x+i] != 'undefined' ) {
			var field = fields()[x+i], 
				value = prepareValue( split[i], field.field_type, {no_ko: true});
			newRows()[y][field.to_param ]( value );
		}
	};
}
