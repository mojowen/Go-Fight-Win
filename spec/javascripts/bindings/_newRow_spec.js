describe("Testing the row template", function() {
  beforeEach(function() {

	factoryList();
	loadFixtures("views/lists/_newRow.html");

	_list = 'test';
	load();
	setBindings();
	ko.applyBindings(dataModel);

  });

  it("renders the fields", function() {
    expect( $('#new_row textarea').length ).toEqual( fields().length );
  });

  it("adds the new row to rows() when submitted", function() {
	var rows_length = rows().length;
	var row = newRows()[0];
	addNewRow( newRows()[0] );
	expect( rows().length ).toEqual( rows_length + 1);
  });

  it("adds a row will move valeus into new row", function() {
	newRows()[0][fields()[0].name]('a value');
	expect($('#new_row textarea:first') ).toHaveValue('a value');
	addNewRow( newRows()[0] );
	expect($('#new_row textarea:first') ).toHaveValue('');
  });

  it("can handle paste", function() {
    // Don't know how to watch for this one
  });

});