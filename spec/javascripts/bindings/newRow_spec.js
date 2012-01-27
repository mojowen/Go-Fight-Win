describe("Testing the new row template and functionality", function() {
	var field_1, field_2, field_3, field_4
  beforeEach(function() {
	factoryList();

	field_1 = fields()[0];
	field_2 = fields()[1];
	field_2['field_type'] = 'select';
	field_2['field_options'] = ['A','B','C'];
	field_3 = fields()[2];
	field_3['field_type'] = 'date';
	field_4 = fields()[3];
	field_4['field_type'] = 'number';

	loadFixtures("views/lists/_row.html","views/lists/_newRow.html");
	ko.applyBindings(dataModel);
	newRows.push( new rowModel({key: 'new', list: _list })  );
	
  });

  it("adds the new row to rows() when submitted", function() {
	var row = newRows()[0];
	spyOn(window,'addNewRow');
	$('#new_row .add').click();
	expect(addNewRow).toHaveBeenCalledWith(row);
  });
  it("adds the new row to rows() when submitted", function() {
	var row_length = rows().length;
	$('.add_new_rows').click();
	expect(rows().length).toEqual(row_length + 1);
  });
  it("adds the new row to rows() when submitted", function() {
	var row_length = rows().length;
	var press = $.Event("keypress");
	press.ctrlKey = false, 
		press.keyCode = 13;
	$('#new_row textarea').trigger(press);
	expect(rows().length).toEqual(row_length + 1);
  });
  it("adds the new row to rows() when submitted", function() {
	expect(rows().length).toEqual(10);
	addNewRow( newRows()[0] )
	expect(rows().length).toEqual(11);
  });
  it("adds a row will move valeus into new row", function() {
	newRows()[0][fields()[0].to_param]('a value');
	expect($('#new_row textarea:first') ).toHaveValue('a value');
	addNewRow( newRows()[0] );
	expect($('#new_row textarea:first') ).toHaveValue('');
  });

  it("can handle paste to create many rows", function() {
	runs( function() { 
		var pastie = "first\nsecond\nthird"
		newRows()[0][field_1.to_param](pastie);
		$('#new_row textarea:first').trigger('paste');
	});
	waits(1);
	runs(function() {
		expect(newRows()[0][field_1.to_param]() ).toEqual('first');
		expect(newRows()[1][field_1.to_param]() ).toEqual('second');
		expect(newRows()[2][field_1.to_param]() ).toEqual('third');
	});
  });
  it("can handle paste to fill columns and rows of many types", function() {
	runs( function() { 
		var pastie = "first\tC\t11/1/11\t1\nsecond\tB\t11/1/10\t69\nthird\tA\t11/1/12\t420"
		newRows()[0][field_1.to_param](pastie);
		$('#new_row textarea:first').trigger('paste');
	});
	waits(1);
	runs(function() {
		expect(newRows()[0][field_1.to_param]() ).toEqual('first');
		expect( $('#new_row select:first') ).toHaveValue('C');
		expect( newRows()[0][field_3.to_param]() ).toEqual( new Date('11/1/11') );
		expect( $('#new_row .date:first') ).toHaveValue( new Date('11/1/11').toDateString() );

		expect( newRows()[0][field_4.to_param]() ).toEqual( 1 );
		
		expect(newRows()[1][field_1.to_param]() ).toEqual('second');
		expect(newRows()[1][field_2.to_param]() ).toEqual('B');
		expect(newRows()[1][field_3.to_param]() ).toEqual( new Date('11/1/10') );
		expect( $('#new_row .date:eq(1)') ).toHaveValue( new Date('11/1/10').toDateString() );
		expect( newRows()[1][field_4.to_param]() ).toEqual( 69 );
		
		expect(newRows()[2][field_1.to_param]() ).toEqual('third');
		expect(newRows()[2][field_2.to_param]() ).toEqual('A');
		expect(newRows()[2][field_3.to_param]() ).toEqual( new Date('11/1/12') );
		expect( $('#new_row .date:eq(2)') ).toHaveValue( new Date('11/1/12').toDateString() );
		expect( newRows()[2][field_4.to_param]() ).toEqual( 420 );
		
		// Adds all of them to rows
		expect( $('.add_new_rows') ).toHaveText('add 3 new rows')
		$('.add_new_rows').click();
		expect( newRows().length).toEqual(1);
		expect(rows().length).toEqual(13);
		
		// Data is correctly added to rows
		expect( rows()[10][field_1.to_param]() ).toEqual('first');
		expect( rows()[10][field_2.to_param]() ).toEqual('C');
		expect( rows()[10][field_3.to_param]() ).toEqual( new Date('11/1/11') );
		expect( rows()[10][field_4.to_param]() ).toEqual( 1 );
		
		expect( rows()[11][field_1.to_param]() ).toEqual('second');
		expect( rows()[11][field_2.to_param]() ).toEqual('B');
		expect( rows()[11][field_3.to_param]() ).toEqual( new Date('11/1/10') );
		expect( rows()[11][field_4.to_param]() ).toEqual( 69 );
		
		expect( rows()[12][field_1.to_param]() ).toEqual('third');
		expect( rows()[12][field_2.to_param]() ).toEqual('A');
		expect( rows()[12][field_3.to_param]() ).toEqual( new Date('11/1/12') );
		expect( rows()[12][field_4.to_param]() ).toEqual( 420 );
	});
  });

});