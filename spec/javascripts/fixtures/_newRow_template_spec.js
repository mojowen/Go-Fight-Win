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
  it("renders the new menu", function() {
	rows.push( new rowModel({key: 'new', list: _list })  );
	expect($('tbody tr:last td:last').html()).toEqual("\n\t<span class=\"add clickable\">Add</span>\n\t<span class=\"remove clickable\">Discard</span>\n");
  });
});