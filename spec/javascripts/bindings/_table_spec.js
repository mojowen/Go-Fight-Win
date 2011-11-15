describe("Testing the row template", function() {
  beforeEach(function() {
	factoryList();
    loadFixtures("views/lists/_table.html");
	ko.applyBindings(dataModel);
  });
  it("renders the fields", function() {
    expect( $('thead th').length ).toEqual( fields().length );
  });
  it("renders the rows", function() {
	expect( $('tbody tr').length).toEqual( rows().length );
  });
  it("renders each of the inputs", function() {
    expect( $('tbody textarea').length).toEqual( rows().length * fields().length );
  });
});