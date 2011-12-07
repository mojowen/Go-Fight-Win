describe("Testing the row template", function() {
  beforeEach(function() {
	factoryList();
	
	loadFixtures("views/lists/_row.html");

	ko.applyBindings(dataModel);
  });
  it("renders the fields", function() {
	setFixtures('<input type="text">')
    expect( $('input').length ).toEqual(  1 );
  });

});