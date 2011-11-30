describe("Testing the row template", function() {
  beforeEach(function() {
	factoryList();
	loadFixtures("views/lists/_row.html","views/lists/_newRow.html");
	_list = 'test';
	load();
	setBindings();
	ko.applyBindings(dataModel);
  });
  it("renders the fields", function() {
    expect( $('#new_row textarea').length ).toEqual( fields().length );
  });
  it("adds the new row to rows() when submitted", function() {
	var row = newRows()[0];
	spyOn(window,'addNewRow');
	$('#new_row .add').click();
	expect(addNewRow).toHaveBeenCalledWith(row);
  });

  it("adds the new row to rows() when submitted", function() {
	expect(rows().length).toEqual(10);
	addNewRow( newRows()[0] )
	expect(rows().length).toEqual(11);
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